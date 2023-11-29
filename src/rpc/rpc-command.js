import { db } from './services/db.js';

export class RpcCommand {
	constructor({ rpcService }) {
		this.rpc = rpcService;
		this.db = db;
	}

	execute() {
		throw new Error('Not implemented');
	}
}
