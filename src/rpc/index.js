import { createLogger } from '../logger.js';
import { rpcService } from './services/rpc.js';
import { databaseService } from './services/db.js';
import { BidCommand } from '../rpc/commands/bid.js';

const logger = createLogger('rpc');

export const rpc = async ({ topic, dbPath } = {}) => {
	logger.info('Init db...');
	await databaseService.init(dbPath);

	logger.info('Init RPC server...');
	const seed = await databaseService.get('rpc-seed');
	await rpcService.init({ seed, dht: databaseService.dht });

	logger.info('Adding RPC commands...');
	rpcService.addCommand('bid', new BidCommand({ rpcService }));

	logger.info('Starting RPC server...');
	await rpcService.startServer();

	if (topic) {
		logger.info(`Looking up auction peer: ${topic}`);
		await rpcService.connect(topic);
		logger.info(`Joined topic: ${topic}`);
	}

	return rpcService;
};
