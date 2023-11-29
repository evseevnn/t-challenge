import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '..', process.env.DB_PATH || '_db');

const bootstrapHosts = process.env.DHT_BOOTSTRAP?.split(',')
	.map((host) => host.split(':'))
	.map(([host, port]) => ({ host, port: parseInt(port) }));

export const config = {
	database: {
		path: dbPath,
	},
	dht: {
		bootstrap: bootstrapHosts || [{ host: '127.0.0.1', port: 30001 }],
	},
};
