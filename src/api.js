import openSocket from 'socket.io-client';
var socket;

const sendMessage = (message) => {
	socket.emit('sendMessage', message);
};
const onReady = (cb) => {
	socket = openSocket('http://104.236.164.210');
	socket.on('onStart', cb);
};
const receiveMessage = (cb) => {
	socket.on('receivedMessage', cb);
};
export { sendMessage, onReady, receiveMessage };