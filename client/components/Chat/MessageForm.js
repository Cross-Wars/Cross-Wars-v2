//component to create and send NEW message
import React, { Component } from "react";
import PropTypes from "prop-types";
// import { Button, InputGroup, FormControl, Form } from 'react-bootstrap';

class MessageForm extends Component {
  static propTypes = {
    onMessageSend: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    // .focus() method sets focus on the specified element, if it can be focused.
    // The focused element is the element which will receive keyboard and similar events by default.
    this.input.focus();
  };

  handleFormSubmit = (event) => {
    //prevent the default form submit
    event.preventDefault();

    // pass the current value of the text input to the onMessageSend function
    this.props.onMessageSend(this.input.value);

    //reset the value of the text input to an empty string.
    this.input.value = "";
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleFormSubmit} className="chat-input">
          <input
            type="text"
            className="chat-msg"
            placeholder="Enter your message..."
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            ref={(node) => (this.input = node)}
          />
          <button variant="outline-secondary" id="button-addon2" type="submit">
            Send
          </button>
        </form>
      </div>
    );
  }
}

export default MessageForm;
