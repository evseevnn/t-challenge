import { createLogger } from '../../logger.js';
import { RpcCommand } from '../rpc-command.js';
import RPC from '@hyperswarm/rpc';

const logger = createLogger('rpc');

class RPCService {
	#client = null;
	#server = null;
	#rpc = null;
	#peers = [];

	constructor() {}

	get rpc() {
		return this.#rpc;
	}

	get server() {
		return this.#server;
	}

	get clients() {
		return this.#rpc.clients;
	}

	get peers() {
		return this.#peers;
	}

	async init({ dht }) {
		this.#rpc = new RPC();
		this.#server = this.#rpc.createServer({ dht });

		this.#server.on('request', (request, response) => {
			logger.info(`RPC request: ${request.command}`);
			response.end('Hello World');
		});

		this.#server.on('error', (err) => {
			logger.error(`RPC server error: ${err.message}`);
		});

		this.#server.on('connection', (socket) => {
			logger.info(`New RPC connection: ${socket.remotePublicKey}`);
		});

		logger.info('RPC server ready to start');
	}

	addCommand(command, handler) {
		if ((!handler) instanceof RpcCommand) {
			throw new Error(
				'Invalid command handler. Must be an instance of RpcCommand',
			);
		}

		this.#server.respond(command, (request) =>
			Buffer.from(JSON.stringify(handler.execute(request))),
		);

		return this;
	}

	/**
	 * Start RPC server
	 */
	async startServer() {
		// Start listening
		await this.#server.listen();

		logger.info(
			`RPC server listening on: ${this.#server.publicKey.toString('hex')}`,
		);
	}

	/**
	 * Request a command to be executed on a remote peer
	 */
	async request(command, args = []) {
		if (!this.#client) {
			throw new Error('Not connected to any peer');
		}

		return await this.#client.request(
			command,
			Buffer.from(JSON.stringify(args)),
		);
	}

	async connect(key) {
		const publicKey = Buffer.from(key, 'hex');
		this.#client = await this.#rpc.connect(publicKey);
		return this.#client;
	}

	async stopServer() {
		await this.#rpc.destroy();
	}
}

export const rpcService = new RPCService();
