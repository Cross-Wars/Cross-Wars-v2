import React from "react";
import { Link, useHistory } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@material-ui/core";
import Instructions from "./Instruction";
import socket from "./socket";

const Navbar = (props) => {
  const history = useHistory();
  const handleClick = () => {
    const room = window.localStorage.getItem("roomId");
    if (room) {
      socket.emit("leave-room", room);
    }
    history.push("/");
  };
  return (
    <nav>
      <div className="nav-bar">
        <Button variant="contained" color="secondary" onClick={handleClick}>
          Home
        </Button>
        <div className="logo">
          <img src="/crosswars2.png" />
        </div>
        <Instructions />
      </div>
    </nav>
  );
};

export default Navbar;
