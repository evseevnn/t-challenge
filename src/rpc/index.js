import { createLogger } from '../logger.js';
import { rpcService } from './services/rpc.js';
import { db } from './services/db.js';
import { dhtService } from './services/dht.js';
import { BidCommand } from '../rpc/commands/bid.js';
import crypto from 'crypto';
import { StartCommand } from './commands/start.js';
import { EndCommand } from './commands/end.js';

const logger = createLogger('rpc');
const DHT_SEED_KEY = 'dht-seed';
const RPC_SEED_KEY = 'rpc-seed';

export const rpc = async ({ topic, dbPath } = {}) => {
	logger.info('Init db...');
	await db.init({ path: dbPath });

	// Getting DHT seed
	let seed = (await db.get(DHT_SEED_KEY))?.value;
	if (!seed) {
		// not found, generate and store in db
		seed = crypto.randomBytes(32);
		await db.put(DHT_SEED_KEY, seed);
	}

	// Init DHT
	logger.info('Init DHT...');
	await dhtService.init({ seed });

	// Init RPC
	logger.info('Init RPC server...');

	// resolve rpc server seed for key pair
	let rpcSeed = (await db.get(RPC_SEED_KEY))?.value;
	if (!rpcSeed) {
		rpcSeed = crypto.randomBytes(32);
		await db.put(RPC_SEED_KEY, rpcSeed);
	}

	await rpcService.init({ seed: rpcSeed, dht: dhtService.dht });

	logger.info('Adding RPC commands...');
	rpcService.addCommand('bid', new BidCommand({ rpcService }));
	rpcService.addCommand('start', new StartCommand({ rpcService }));
	rpcService.addCommand('end', new EndCommand({ rpcService }));

	logger.info('Starting RPC server...');
	await rpcService.startServer();

	if (topic) {
		logger.info(`Looking up auction peer: ${topic}`);
		await rpcService.connect(topic);
		logger.info(`Joined topic: ${topic}`);
	} else {
		// connect to self
		logger.info('Connecting to self...');
		await rpcService.connect(rpcService.server.publicKey);
	}

	return rpcService;
};
