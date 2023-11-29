import { createLogger } from './logger.js';
import { Auction } from './auction.js';
import { rpc } from './rpc/index.js';

const logger = createLogger('auction');

export class User {
	#name;
	#rpc;

	constructor({ name }) {
		this.#name = name;
	}

	get topic() {
		return this.#rpc?.server.publicKey.toString('hex') || null;
	}

	/**
	 * Create Auction
	 */
	async createAuction() {
		this.#rpc = await rpc({ dbPath: `./_db/${this.#name}` });
		const auction = new Auction(this.#rpc);
		logger.info(`Auction with topic: ${this.topic} initialized`);

		return auction;
	}

	/**
	 * Connect to Auction
	 */
	async connectToAuction({ topic } = {}) {
		if (!topic) {
			throw new Error('Topic is required');
		}

		logger.info(`Connecting to topic: ${topic}`);
		const rpcInstance = await rpc({ topic, dbPath: `./_db/${this.#name}` });
		const auction = new Auction(rpcInstance);

		return auction;
	}
}
