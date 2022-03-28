import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@material-ui/core";
import Instructions from "./Instruction";

const Navbar = ({ handleClick, isLoggedIn }) => (
  <nav>
    <div className="nav-bar">
      <Link to="/">
        <Button variant="contained" color="secondary">
          Home
        </Button>
      </Link>
      <div className="logo">
        <Logo />
      </div>
      <h1>🔪 CrossWars 🔪</h1>
      <Instructions />
    </div>
  </nav>
);

export default Navbar;
