import { RpcCommand } from '../rpc-command.js';
import { createLogger } from '../logger.js';

const logger = createLogger('rpc:command:list');

export class ListCommand extends RpcCommand {
	execute(args) {
		logger.info('ListCommand.execute', args);

		// Create record in database
		this.rpc.lookup('auctions');

		return 'Start';
	}
}
