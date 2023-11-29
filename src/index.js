import { createLogger } from './logger.js';
import { Auction } from './auction.js';

const logger = createLogger('auction');

(async () => {
	// Client 1 starting new auction
	const auctionServer = new Auction();
	await auctionServer.init();

	const auction1 = new Auction(auctionServer.topic);
	await auction1.start(50);

	// Client 2 creating new auction
	const auction2 = new Auction();
	await auction2.init();
	await auction2.start(75);

	// Client 2 placing bid
	const clientOfAuction1 = new Auction(auction1.topic);
	await clientOfAuction1.init();
	await clientOfAuction1.placeBid(100);

	// Client 3 placing bid
	const client3OfAuction1 = new Auction(auction1.topic);
	await client3OfAuction1.init();
	await client3OfAuction1.placeBid(200);

	await clientOfAuction1.placeBid(300);

	const result = auction1.end();

	logger.info(`Auction result: ${result}`);
})();
