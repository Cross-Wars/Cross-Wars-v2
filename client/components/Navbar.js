import React from "react"
import { Link, useHistory } from "react-router-dom"
import { connect, useDispatch, useSelector } from "react-redux"
import Logo from "./Logo"
import { Button } from "@material-ui/core"
import { logout } from "../store"
import Instructions from "./Instruction"
import socket from "./socket"

const Navbar = ({ handleClickLogout, isLoggedIn, username }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const handleClick = () => {
    const room = window.localStorage.getItem("roomId")
    if (room) {
      socket.emit("leave-room", room)
    }
    history.push("/")
  }
  console.log(isLoggedIn)
  return (
    <nav>
      {isLoggedIn ? (
        <div className="nav-bar">
          <Button variant="contained" color="secondary" onClick={handleClick}>
            Home
          </Button>
          <div className="logo">
            <Logo />
          </div>
          <h1>🔪 CrossWars 🔪</h1>
          <Instructions />
          <Button variant="contained" color="secondary">
            <a href="#" onClick={handleClickLogout}>
              Logout
            </a>
          </Button>
        </div>
      ) : (
        <div className="nav-bar">
          <Button variant="contained" color="secondary" onClick={handleClick}>
            Home
          </Button>
          <div className="logo">
            <Logo />
          </div>
          <h1>🔪 CrossWars 🔪</h1>
          <Instructions />
          <Button variant="contained" color="secondary">
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="contained" color="secondary">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      )}
    </nav>
  )
}

const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,

    username: state.auth.username,
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleClickLogout() {
      dispatch(logout())
    },
  }
}

export default connect(mapState, mapDispatch)(Navbar)
