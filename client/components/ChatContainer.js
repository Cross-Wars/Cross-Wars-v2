import React, { useState, useEffect } from "react";
import socket from "./socket";
import ChatMessageList from "./ChatMessageList";
import ChatNewMessageForm from "./ChatNewMessageForm";

export default function ChatContainer(props) {
  const [state, setState] = useState({ messages: [] });

  useEffect(() => {
    //listen for new incoming messages:
    socket.on("receive-message", (message, sendingUser, roomId) => {
      setState({
        messages: [
          ...state.messages,
          { me: false, author: sendingUser, body: message, room: roomId },
        ],
      });
      console.log(state);
    });
  }, []);

  //send out new messages:
  const handleNewMessage = (text) => {
    setState({
      messages: [...state.messages, { me: true, author: "Me", body: text }],
    });
    const sendingUser = window.localStorage.getItem("focus");
    const room = window.localStorage.getItem("roomId");
    socket.emit("send-message", text, sendingUser, room);
  };

  return (
    <div className="Chat">
      <div className="header">Live Chat💬</div>
      {/* Will render list of all messages sent */}
      {/* <ChatMessageList messages={state.messages} /> */}
      {/* Will render the INPUT text to submit new messages to the 'message list': */}
      <ChatNewMessageForm onMessageSend={handleNewMessage} />
    </div>
  );
}
