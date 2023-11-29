import { RpcCommand } from '../rpc-command.js';
import { createLogger } from '../../logger.js';

const logger = createLogger('rpc:command:bid');

export class BidCommand extends RpcCommand {
	execute(args) {
		logger.info('BidCommand', args);
		return 'Bid';
	}
}
