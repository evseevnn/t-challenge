import { config } from '../config.js';
import { createLogger } from '../logger.js';
import { RpcCommand } from '../rpc-command.js';
import RPC from '@hyperswarm/rpc';
import DHT from 'hyperdht';
import crypto from 'crypto';

const logger = createLogger('rpc');

class RPCService {
	#dhtConfig = {};
	#dht = null;
	#rpc = null;

	constructor(dhtConfig) {
		const dhtSeed = crypto.randomBytes(32);
		this.#dhtConfig = {
			keyPair: DHT.keyPair(dhtSeed),
			...dhtConfig,
		};
	}

	async init() {
		this.#dht = new DHT(this.#dhtConfig);
		await this.#dht.ready();

		logger.info('DHT ready');

		const rpc = new RPC({ dht: this.#dht });
		this.#rpc = rpc.createServer();

		this.#rpc.on('connection', (socket) => {
			logger.info(`New RPC connection: ${socket.remotePublicKey}`);
		});

		logger.info('RPC server ready to start');
	}

	addCommand(command, handler) {
		if ((!handler) instanceof RpcCommand) {
			throw new Error(
				'Invalid command handler. Must be an instance of RpcCommand',
			);
		}

		this.#rpc.respond(command, handler.execute);

		return this;
	}

	/**
	 * Start RPC server
	 */
	async startServer() {
		// Start listening
		await this.#rpc.listen();

		logger.info(
			`RPC server listening on: ${this.#rpc.publicKey.toString('hex')}`,
		);
	}

	/**
	 * Request a command to be executed on a remote peer
	 */
	async request(key, command, args) {
		return await this.#rpc.request(key, command, args);
	}

	/**
	 * Lookup a key on the DHT
	 */
	async lookup(key) {
		return await this.#dht.lookup(key);
	}

	async stopServer() {
		await this.#rpc.destroy();
		await this.#dht.destroy();
	}
}

export const rpcService = new RPCService(config.dht);
