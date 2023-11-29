import Hypercore from 'hypercore';
import Hyperbee from 'hyperbee';
import { config } from '../config.js';
import { createLogger } from '../logger.js';

const logger = createLogger('db');

class DatabaseService {
	#instance = null;

	constructor(path) {
		this.path = path;
	}

	async init() {
		const core = new Hypercore(this.path);
		const db = new Hyperbee(core, {
			keyEncoding: 'utf-8',
			valueEncoding: 'json',
		});
		this.#instance = await db.ready();

		logger.info('Database ready');
	}

	async close() {
		await this.#instance.close();
	}
}

export const databaseService = new DatabaseService(config.database.path);
