const bootstrapHosts = process.env.DHT_BOOTSTRAP?.split(',')
	.map((host) => host.split(':'))
	.map(([host, port]) => ({ host, port: parseInt(port) }));

export const config = {
	database: {
		path: process.env.DB_PATH || '../_db/auction-server',
	},
	dht: {
		bootstrap: bootstrapHosts || [{ host: '127.0.0.1', port: 30001 }],
	},
};
