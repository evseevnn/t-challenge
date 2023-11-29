import Hypercore from 'hypercore';
import Hyperbee from 'hyperbee';
import { config } from '../../config.js';
import { createLogger } from '../../logger.js';
import DHT from 'hyperdht';
import crypto from 'crypto';

const logger = createLogger('db');

class DatabaseService {
	#instance = null;
	#dht = null;

	get dht() {
		return this.#dht;
	}

	async init(path) {
		const core = new Hypercore(path);
		this.#instance = new Hyperbee(core, {
			keyEncoding: 'utf-8',
			valueEncoding: 'json',
		});
		await this.#instance.ready();

		// resolved distributed hash table seed for key pair
		let dhtSeed = (await this.get('dht-seed'))?.value;
		if (!dhtSeed) {
			// not found, generate and store in db
			dhtSeed = crypto.randomBytes(32);
			await this.put('dht-seed', dhtSeed);
		}

		// start distributed hash table, it is used for rpc service discovery
		this.#dht = new DHT({
			port: 50001,
			keyPair: DHT.keyPair(dhtSeed),
			bootstrap: [{ host: '127.0.0.1', port: 30001 }], // note boostrap points to dht that is started via cli
		});

		await this.#dht.ready();

		/// RPC seed TODO: move to rpc service

		// resolve rpc server seed for key pair
		let rpcSeed = (await this.get('rpc-seed'))?.value;
		if (!rpcSeed) {
			rpcSeed = crypto.randomBytes(32);
			await this.put('rpc-seed', rpcSeed);
		}

		logger.info('Database ready');
	}

	async get(key) {
		return await this.#instance.get(key);
	}

	async put(key, value) {
		return await this.#instance.put(key, value);
	}

	async close() {
		await this.#instance.close();
	}
}

export const databaseService = new DatabaseService(config.database.path);
