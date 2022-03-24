
import React, { useState, useEffect } from 'react';
import socket from './socket';
import { uid } from 'uid';
import Logo from './Logo';
import Footer from './Footer';

export default function JoinOrCreateRoom(props) {
  // const [newKey, setNewKey] = useState("");
  // const [joinKey, setJoinKey] = useState("");
  // const [roomId, setRoomId] = useState("");
  // const [host, setHost] = useState(false);
  // const [username, setUsername] = useState("user-name");
  const [state, setState] = useState({
    color: 'blue',
    nickname: 'WordCrosser',
    host: false,
    roomId: '',
    socket: null,
  });

  useEffect(() => {
    console.log(props, socket);
    setState({ ...state, socket: socket });
    const room = props.location.search.substring(1);
    if (!room) {
      const newRoomId = uid();
      setState({ ...state, roomId: newRoomId, host: true });
    } else {
      setState({ ...state, roomId: room });
    }
    socket.on('room-full', () => {
      props.history.push('/error');
    });
  }, []);

  const handleNickNameChange = (evt) => {
    setState({ ...state, nickname: evt.target.value });
  };

  const handleColorChange = (evt) => {
    setState({ ...state, color: evt.target.value });
  };

  // const handleJoinKeyChange = (evt) => {
  //   setJoinKey(evt.target.value);
  // };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    socket.emit('set-info', state);
    socket.emit('join-room', state.roomId);
    window.localStorage.setItem('roomId', state.roomId);
    window.localStorage.setItem('host', state.host);
    props.history.push(`/lobby/${state.roomId}`);
    // props.history.push("/game");
    console.log(state);
  };

  // const handleJoinSubmit = (evt) => {
  //   evt.preventDefault();
  //   // socket stuff
  // };

  return (
    <div className="splash-container">
      <div className="splash">
    <Logo />
        <h1 className="splash-head">🔪 CrossWars 🔪</h1>
        <form>
          <label htmlFor="nickname-input">Enter Your Nickname</label>
          <input
            name="nickname-input"
            onChange={handleNickNameChange}
            type="text"
            value={state.nickname}
          />
          <label htmlFor="color-select">Choose a Color</label>
          <select defaultValue={state.color} onChange={handleColorChange}>
            <option value="blue">blue</option>
            <option value="red">red</option>
            <option value="green">green</option>
            <option value="yellow">yellow</option>
            <option value="pink">pink</option>
            <option value="orange">orange</option>
            <option value="purple">purple</option>
          </select>
        </form>
        {props.location.search.substring(1) ? (
          <form onSubmit={handleSubmit}>
            <button type="submit">JOIN ROOM</button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <button className="pure-button" type="submit">
              CREATE ROOM
            </button>
          </form>
        )}
        <Footer />
      </div>
    </div>
  );
}
