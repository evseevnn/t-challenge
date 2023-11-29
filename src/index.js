import { createLogger } from './logger.js';
import { User } from './user.js';
import { db } from './rpc/services/db.js';

const logger = createLogger('auction');

(async () => {
	logger.info('Build p2p network');

	// User 1 creates auction 1
	const user1 = new User({ name: 'user1' });
	const auction1 = await user1.createAuction();
	await auction1.start('Pic#1', 75);
})();
