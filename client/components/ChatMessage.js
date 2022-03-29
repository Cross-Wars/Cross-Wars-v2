import React, { useState } from "react";
//to style the messages differently depending on which user sent it:
//(it's a "A simple JavaScript utility for conditionally joining classNames together.")
import classNames from "classnames";

export default function ChatMessage(props) {
  const [state, setState] = useState({
    author: "",
    body: "",
    me: false,
  });

  const classes = classNames("Message", {
    log: !props.author,
    me: props.me,
  });

  return (
    <div className={classes}>
      {props.author && <span className="author">{props.author}:</span>}
      {props.body}
    </div>
  );
}
