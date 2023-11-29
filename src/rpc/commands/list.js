import { RpcCommand } from '../rpc-command.js';
import { createLogger } from '../logger.js';

const logger = createLogger('rpc:command:list');

export class ListCommand extends RpcCommand {
	execute(args) {
		return 'list';
	}
}
