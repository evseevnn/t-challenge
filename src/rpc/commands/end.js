import { RpcCommand } from '../rpc-command.js';

export class EndCommand extends RpcCommand {
	execute() {
		// Create record in database
		return 'End';
	}
}
