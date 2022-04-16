//component that holds all the parts of the chat box (messages and message input to send a new message)
import React, { Component } from "react";
import MessageForm from "./MessageForm";
import MessageList from "./MessageList";
import socket from "../socket";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    socket.on("receive-message", (message, sendingUser, room) => {
      this.setState({
        messages: [
          ...this.state.messages,
          //each message is an object with properties me, author, body, and room
          { me: false, author: sendingUser, body: message, room: room },
        ],
      });
    });
  }

  //defined here because this is where the socket is listening for a new message (?)
  //handler function for when you send a new message:
  handleNewMessage = (text) => {
    this.setState({
      messages: [
        ...this.state.messages,
        { me: true, author: "Me", body: text },
      ],
    });
    const sendingUser = window.localStorage.getItem("focus");
    const room = window.localStorage.getItem("roomId");
    socket.emit("send-message", text, sendingUser, room);
  };

  render() {
    return (
      <div className="Chat">
        <div className="header">Talk Some Smack 💬</div>
        {/* Will render list of all messages sent */}
        <MessageList messages={this.state.messages} />
        {/* Will render the INPUT text to submit new messages to the 'message list': */}
        <MessageForm onMessageSend={this.handleNewMessage} />
      </div>
    );
  }
}

export default Chat;
