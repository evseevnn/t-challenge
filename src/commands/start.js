import { RpcCommand } from '../rpc-command.js';

export class StartCommand extends RpcCommand {
	execute() {
		// Create record in database
		this.db;

		return 'Start';
	}
}
