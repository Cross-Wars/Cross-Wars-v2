import React, { useState, useEffect } from 'react';
import socket from './socket';
import { uid } from 'uid';
import Logo from './Logo';
import Footer from './Footer';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import generator from './randomNamer';
import { useSelector } from 'react-redux';
import Instructions from './Instruction';

export default function JoinOrCreateRoom(props) {
  const isLoggedIn = useSelector((state) => !!state.auth.id);
  const userName = useSelector((state) => state.auth.username);
  const name = isLoggedIn ? userName : 'WordCrosser';
  const [isDesktop, setDesktop] = useState(window.innerWidth > 700);
  const [state, setState] = useState({
    color: 'blue',
    highlightBackground: '#9CC3D5FF',
    nickname: generator(),
    host: false,
    roomId: '',
    socket: null,
  });

  //hook for re-rendering when the screen width changes:
  useEffect(() => {
    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  useEffect(() => {
    setState({ ...state, nickname: name });
  }, [isLoggedIn]);

  useEffect(() => {
    const puzzle = window.localStorage.getItem('puzzle');
    console.log(puzzle);
    if (puzzle) {
      window.localStorage.removeItem('puzzle');
      document.location.reload();
    }
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

  //helper function to add listener for changes in screen width
  const updateMedia = () => {
    setDesktop(window.innerWidth > 700);
  };

  const handleNickNameChange = (evt) => {
    setState({ ...state, nickname: evt.target.value });
  };

  const handleColorChange = (evt) => {
    if (evt.target.value === '#D9514EFF') {
      setState({
        ...state,
        color: evt.target.value,
        highlightBackground: '#A9E5BBFF',
      });
    } else if (evt.target.value === 'orange') {
      setState({
        ...state,
        color: evt.target.value,
        highlightBackground: '#FBDE44FF',
      });
    } else if (evt.target.value === '#0A5E2AFF') {
      setState({
        ...state,
        color: evt.target.value,
        highlightBackground: '#6DAC4FFF',
      });
    } else if (evt.target.value === '#93385FFF') {
      setState({
        ...state,
        color: evt.target.value,
        highlightBackground: '#F99FC9FF',
      });
    } else if (evt.target.value === '#D34F73FF') {
      setState({
        ...state,
        color: evt.target.value,
        highlightBackground: '#DBBEA1FF',
      });
    } else if (evt.target.value === '#FF4F58FF') {
      setState({
        ...state,
        color: evt.target.value,
        highlightBackground: '#669DB3FF',
      });
    } else if (evt.target.value === '#CE4A7EFF') {
      setState({
        ...state,
        color: evt.target.value,
        highlightBackground: '#DBBEA1FF',
      });
    }
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    socket.emit('set-info', state);
    socket.emit('join-room', state.roomId);
    window.localStorage.setItem(
      'color',

      `${state.color} ${state.highlightBackground}`
    );
    window.localStorage.setItem('focus', state.nickname);
    window.localStorage.setItem('roomId', state.roomId);
    window.localStorage.setItem('host', state.host);
    props.history.push(`/lobby/${state.roomId}`);
  };

  return (
    <div>
      {isDesktop ? (
        <div className="joinOrCreateRoom-container">
          <div id="create-form">
            <div id="landing-page-logo">
              <Logo />
            </div>
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
                <option value="blue">Blue</option>
                <option value="#D9514EFF">Red</option>
                <option value="#0A5E2AFF">Dark Green</option>
                <option value="#D34F73FF">Mystic</option>
                <option value="#FF4F58FF">Fiery Coral</option>
                <option value="orange">Orange</option>
                <option value="#CE4A7EFF">Pink</option>
                <option value="#93385FFF">Purple</option>
              </select>
            </form>
            {props.location.search.substring(1) ? (
              <form onSubmit={handleSubmit}>
                <Button variant="contained" color="secondary" type="submit">
                  JOIN ROOM
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <Button variant="contained" color="secondary" type="submit">
                  CREATE ROOM
                </Button>
              </form>
            )}
            <Instructions />
          </div>

          <Footer />
        </div>
      ) : (
        <div className="joinOrCreateRoom-container">
          <div id="create-form">
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
                <option value="blue">Blue</option>
                <option value="#D9514EFF">Red</option>
                <option value="#0A5E2AFF">Dark Green</option>
                <option value="#D34F73FF">Mystic</option>
                <option value="#FF4F58FF">Fiery Coral</option>
                <option value="orange">Orange</option>
                <option value="#CE4A7EFF">Pink</option>
                <option value="#93385FFF">Purple</option>
              </select>
            </form>
            {props.location.search.substring(1) ? (
              <form onSubmit={handleSubmit}>
                <Button variant="contained" color="secondary" type="submit">
                  JOIN ROOM
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <Button variant="contained" color="secondary" type="submit">
                  CREATE ROOM
                </Button>
              </form>
            )}
            <Instructions />
          </div>

          <Footer />
        </div>
      )}
    </div>
  );
}
