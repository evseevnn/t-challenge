import DHT from 'hyperdht';
import { config } from '../../config.js';

class DHTService {
	#dht;

	async init({ seed }) {
		// start distributed hash table, it is used for rpc service discovery
		this.#dht = new DHT({
			port: 50001,
			keyPair: DHT.keyPair(seed),
			bootstrap: config.dht.bootstrap,
		});

		await this.#dht.ready();
	}

	get dht() {
		return this.#dht;
	}
}

export const dhtService = new DHTService();
