// component to hold all messages in chat
import React, { Component } from "react";
import PropTypes from "prop-types";
//^to define the types of data we expect for our props, we’ll want to install the prop-types library.
//^ I installed: npm install --save prop-types
import Message from "./Message";

class MessageList extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    messages: [],
  };

  componentDidUpdate = () => {
    // scroll to the bottom of the window whenever the component is updated.
    this.node.scrollTop = this.node.scrollHeight;
  };

  render() {
    return (
      //iterate over our new array of messages
      //return an html element containing the message content.
      <div className="MessageList" ref={(node) => (this.node = node)}>
        {this.props.messages.map((message, i) => (
          <Message key={i} {...message} />
        ))}
      </div>
    );
  }
}

export default MessageList;
