import React, { useEffect } from "react";
import Button from "@material-ui/core";

export default function ChatNewMessageForm(props) {
  useEffect(() => {
    const messageInput = document.getElementById("message");
    if (messageInput) {
      messageInput.focus();
    }
  }, []);

  const handleFormSubmit = (event) => {
    const messageInput = document.getElementById("message");
    //prevent the default form submit
    event.preventDefault();

    // pass the current value of the text input to the onMessageSend function
    props.onMessageSend(messageInput.value);

    //reset the value of the text input to an empty string.
    messageInput.value = "";
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        id="message"
        placeholder="Type message here..."
      ></input>
      {/* <Button variant="contained" color="secondary" type="submit">Submit</Button> */}
    </form>
  );
}
