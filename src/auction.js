import { createLogger } from './logger.js';
import { rpc } from './rpc/index.js';

const logger = createLogger('auction');

export class Auction {
	#rpc = null;

	constructor(topic) {
		this.topic = topic;
	}

	async init() {
		logger.info('Starting new auction...');
		const random = Math.floor(Math.random() * 1000);
		this.#rpc = await rpc({ topic: this.topic, dbPath: `./_db/${random}` });
		this.topic = this.#rpc.server.publicKey.toString('hex');

		logger.info(`Auction with topic: ${this.topic} initialized`);
	}

	async start(startingBid) {
		logger.info(`Starting auction with bid: ${startingBid}`);
		const result = await this.#rpc.request('start', [startingBid]);

		logger.info(`Auction start with price: ${JSON.parse(result.toString())}`);
		return result;
	}

	async placeBid(amount) {
		const result = await this.#rpc.request('bid', [amount]);
		logger.info(`Bid response: ${JSON.parse(result.toString())}`);
		return result;
	}

	async end() {
		const result = await this.#rpc.request('end');
		logger.info(`Auction end with result: ${JSON.parse(result.toString())}`);
		return result;
	}
}
