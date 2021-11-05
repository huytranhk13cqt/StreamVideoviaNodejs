const express = require('express');
const path = require('path');
const WebSocket = require('ws');

// --------------------Server Create-------------------- //
const app = express();
const WS_PORT = 8808;
const HTTP_PORT = 8000;

const wsServer = new WebSocket.Server({ port: WS_PORT }, () => {
	console.log(`WebSocket Server is listening at ${WS_PORT}`);
});

// keep all connected clients in the array
let connectedClients = [];

let dem = 1;

// after the WebSocket connection, this function will be called
wsServer.on('connection', (ws, req) => {
	// thông báo đến Dev

	console.log('Connected', dem++);
	if (dem === 11) {
		dem = 1;
	}

	// push data ws vào mảng
	connectedClients.push(ws);

	// if there is a message from one of the clients, send it to all other clients
	// if one of the clients doesn't have an opened connection, remove it from mảng connectedClients[]
	ws.on('message', (data) => {
		// duyệt mảng connectedClients đến từng clients
		connectedClients.forEach((ws, i) => {
			if (ws.readyState === ws.OPEN) {
				ws.send(data);
			} else {
				connectedClients.splice(i, 1);
			}
		});
	});
});

// For the client's browser, we need to have an HTML doc
// the path will be /client and it's loading the client.html file we make before
app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, './client.html'));
});

// Also, this server needs to listen to 8000 port for the client's HTTP connection which is from desktop, mobile whaterver
app.listen(HTTP_PORT, () => {
	console.log(`Server started on http://localhost:${HTTP_PORT}/`);
});
