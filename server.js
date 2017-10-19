var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var https = require('https');
var fs = require('fs');
var messages = [];

app.use(express.static('build'))
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/build/index.html');
});

const filterArray = (items) => {
	while (items.length > 10) {
		items.shift();
	}
	return items;
};

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

http.listen(3000, () => {
	console.log('http listening on *:3000');
});
if (process.env.NODE_ENV == 'production') {
	var https_options = {
		key: fs.readFileSync('./www.anonymous-chatroom.com.key'),
		cert: fs.readFileSync('./www.anonymous-chatroom.com.crt')
	};
	https.createServer(https_options, app).listen(3001);
	console.log('https listening on %s:%s', 3001);
}