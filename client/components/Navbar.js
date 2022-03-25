import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";
import Logo from "./Logo";
import { Button } from "@material-ui/core";

const Navbar = ({ handleClick, isLoggedIn }) => (
  <nav>
    <div className="nav-bar">
      <div className="logo">
        <Logo />
      </div>
      <h1>🔪 CrossWars 🔪</h1>
      <Link to="/instructions">
        <Button variant="contained" color="secondary">
          HOW TO PLAY
        </Button>
      </Link>
    </div>
    {/* <nav>
      {isLoggedIn ? (
        <div>
          <Link to="/home">Home</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
        </div>
      ) : (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav> */}
    <hr />
  </nav>
);

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
