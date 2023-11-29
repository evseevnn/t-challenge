import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '..', process.env.DB_PATH || '_db');

export const config = {
	database: {
		path: dbPath,
	},
};
