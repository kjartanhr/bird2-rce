# bird2-rce

This is an extremely simple Express.js web server that communicates with bird2 via the Linux shell. It can be used to remotely fetch routes from a specified ASN in the global routing table via a REST interface. That GET route lives at /routes/:as.

While I do plan on adding more routes to this project (e.g. GET /routes - to get the full table) I thought I would publish this code in case anyone finds it useful. There are some useful salvagable parts in here, like the routing table parser in /lib/router_parser.js.

Feel free to contribute via pull request.

> ⚠️ This code should not be used in production.

# License

MIT