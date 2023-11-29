class DHTService {
	constructor({ rpcService }) {
		this.rpcService = rpcService;
		this.dbService = rpcService.dbService;
	}

	execute() {
		throw new Error('Not implemented');
	}
}

export const dhtService = new DHTService();
