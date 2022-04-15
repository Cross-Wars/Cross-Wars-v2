// component for an individual message
import React, { Component } from "react";
import PropTypes from "prop-types";

// npm install --save classnames
// To style the messages differently,
import classNames from "classnames";

//keep as a class component because of this static propTypes business
class Message extends Component {
  static propTypes = {
    author: PropTypes.string,
    body: PropTypes.string.isRequired,
    me: PropTypes.bool,
  };

  render() {
    const classes = classNames("Message", {
      log: !this.props.author,
      me: this.props.me,
    });

    // console.log(this.props.author);
    return (
      <div className={classes}>
        {this.props.author && (
          <span className="author">{this.props.author}:</span>
        )}
        {this.props.body}
      </div>
    );
  }
}

export default Message;
