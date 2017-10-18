import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';
import { sendMessage, onReady, receiveMessage } from './api.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			input: null,
			messages: [],
			isFirstTime: true,
			username: null
		};
		this.onSend = this.onSend.bind(this);
		this.onSignUp = this.onSignUp.bind(this);
	}
	componentWillMount() {
		if (localStorage && localStorage.username)
			this.setState({ isFirstTime: false, username: localStorage.username });
	}
	componentDidMount() {
		onReady((msgs) => {
			this.setState({ messages: msgs });
			this.scrollToBottom();
		});
		receiveMessage((msg) => {
			this.setState({ messages: [...this.state.messages, msg] });
			this.scrollToBottom();
		});
	}
	onSend(e) {
		if (e) e.preventDefault();
		if (this.state.input) {
			sendMessage({ username: this.state.username, message: this.state.input });
			this.setState({ input: '' });
		}
	}
	onSignUp(e) {
		e.preventDefault();
		if (this.state.username && this.state.input) {
			localStorage.username = this.state.username
			this.setState({ isFirstTime: false, username: this.state.username });
			this.onSend();
		}
	}
	scrollToBottom() {
		const node = ReactDOM.findDOMNode(this.messageList);
		if (node)
			node.scrollIntoView({ behavior: 'smooth' });
	}
	render() {
		return (
			<div className='container'>
				{this.state.isFirstTime ?
					<div>
						<div className='row d-flex justify-content-center align-items-center'>
							<div className='jumbotron'>
								<h1 className='display-3'>Welcome!</h1>
								<p className='lead'>
									This is a social experiment that
									let's strangers strike up a conversion in an anonymous
									chatroom. If this link popped up on your phone it
									means we are pretty close to each other, can you guess who I am?!
									Either way let's get started, input any name you want below
									and your first message to the group.
								</p>
							</div>
						</div>
						<div className='row mb-5 d-flex justify-content-center align-items-center'>
							<div className='col'>
								<form onSubmit={this.onSignUp} style={{ marginTop: 22 }}>
									<div className='input-group input-group-lg'>
										<span className='input-group-addon' id='basic-addon1'>@</span>
										<input autoFocus onChange={(e) => this.setState({ username: e.target.value })} value={this.state.username} type='text' className='form-control' placeholder='Username' aria-label='Username' aria-describedby='basic-addon1' />
									</div>
									<br />
									<div className='input-group input-group-lg'>
										<input onChange={(e) => this.setState({ input: e.target.value })} value={this.state.input} type='text' className='form-control' placeholder='Message' aria-label='Message' aria-describedby='basic-addon3' />
										<span className='input-group-addon' onClick={this.onSignUp} id='basic-addon3'>Send</span>
									</div>
								</form>
							</div>
						</div>
					</div> : <div className='row mb-3'>
						<div className='col'>
							<div>{this.state.messages.map(item => <div><strong>{item.username}:</strong> {item.message}</div>)}</div>
							<div style={{ float: 'left', clear: 'both' }}
								ref={(el) => { this.messageList = el; }}>
							</div>
							<form onSubmit={this.onSend} style={{ marginTop: 22 }}>
								<div className='input-group fixed-bottom'>
									<input autoFocus onChange={(e) => this.setState({ input: e.target.value })} value={this.state.input} type='text' className='form-control' placeholder='Message' aria-label='Message' aria-describedby='basic-addon2' />
									<span className='input-group-addon' onClick={this.onSend} id='basic-addon2'>Send</span>
								</div>
							</form>
						</div>
					</div>}
			</div>
		);
	}
}
export default App;
