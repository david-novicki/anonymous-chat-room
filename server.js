var express = require('express');
var app = express();
var http = require('http').Server(app);
var https = require('https');
var fs = require('fs');
var messages = [];

app.use(express.static('build'))
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/build/index.html');
});

// http.listen(3000, () => {
// 	console.log('http listening on *:3000');
// });
if (process.env.NODE_ENV == 'production') {
	var https_options = {
		key: fs.readFileSync('./www.anonymous-chatroom.com.key'),
		cert: fs.readFileSync('./www.anonymous-chatroom.com.crt')
	};
	var server = https.createServer(https_options, app);
	const filterArray = (items) => {
		while (items.length > 10) {
			items.shift();
		}
		return items;
	};
	var io = require('socket.io')(server);
	io.on('connection', (socket) => {
		console.log('a user connected');
		socket.emit('onStart', filterArray(messages));
		socket.on('sendMessage', (message) => {
			console.log(message);
			messages.push(message);
			io.sockets.emit('receivedMessage', message);
		})
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
	});
	server.listen(3001, () => {
		console.log('https listening on ', 3001);
	});
}