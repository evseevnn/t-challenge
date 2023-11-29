import { databaseService } from './services/db.js';

export class RpcCommand {
	constructor({ rpcService }) {
		this.rpc = rpcService;
		this.db = databaseService;
	}

	execute() {
		throw new Error('Not implemented');
	}
}
