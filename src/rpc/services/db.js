import Hypercore from 'hypercore';
import Hyperbee from 'hyperbee';
import { config } from '../../config.js';
import { createLogger } from '../../logger.js';

const logger = createLogger('db');

class DatabaseService {
	#db = null;

	async init({ path }) {
		const core = new Hypercore(path);
		this.#db = new Hyperbee(core, {
			keyEncoding: 'utf-8',
			valueEncoding: 'binary',
		});
		await this.#db.ready();

		logger.info('Database ready');
	}

	async get(key) {
		return await this.#db.get(key);
	}

	async put(key, value) {
		return await this.#db.put(key, value);
	}

	async close() {
		await this.#db.close();
	}
}

export const db = new DatabaseService(config.database.path);
