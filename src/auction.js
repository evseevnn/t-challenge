import { createLogger } from './logger.js';

const logger = createLogger('auction');

export class Auction {
	#rpc;

	constructor(rpc) {
		this.#rpc = rpc;
	}

	async start(name, startingBid) {
		logger.info(`Starting auction for ${name} with bid: ${startingBid}`);
		const result = await this.#rpc.request('start', [name, startingBid]);

		logger.info(`response: ${JSON.parse(result.toString())}`);
		return result;
	}

	async placeBid(name, amount) {
		const result = await this.#rpc.request('bid', [name, amount]);
		logger.info(`Bid response: ${JSON.parse(result.toString())}`);
		return result;
	}

	async end(name) {
		const result = await this.#rpc.request('end', [name]);
		logger.info(`Auction end with result: ${JSON.parse(result.toString())}`);
		return result;
	}
}
