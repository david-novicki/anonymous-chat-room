import openSocket from 'socket.io-client';
var socket;

const sendMessage = (message) => {
	socket.emit('sendMessage', message);
};
const onReady = (cb) => {
	socket = openSocket('http://www.anonymous-chatroom.com');
	socket.on('onStart', cb);
};
const receiveMessage = (cb) => {
	socket.on('receivedMessage', cb);
};
export { sendMessage, onReady, receiveMessage };