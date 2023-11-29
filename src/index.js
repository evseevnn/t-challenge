import { rpcService } from './services/rpc.js';
import { databaseService } from './services/db.js';
import { createLogger } from './logger.js';
import { BidCommand } from './commands/bid.js';

const logger = createLogger('bootstrap');

(async () => {
	logger.info('Init db...');
	await databaseService.init();

	logger.info('Init RPC server...');
	await rpcService.init();

	logger.info('Adding RPC commands...');
	rpcService.addCommand('bid', new BidCommand({ rpcService }));

	logger.info('Starting RPC server...');
	await rpcService.startServer();

	const results = await rpcService.lookup('auction', { announce: true });
	logger.info(`Found ${results.length} auction peers`, results);
})();
