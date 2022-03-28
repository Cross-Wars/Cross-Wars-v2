import React from "react"

import Logo from "./Logo"
import { Link } from "react-router-dom"

const Error = () => {
  return (
    <div className="splash-container">
      <div className="splash">
        <div id="create-form">
          <div id="landing-page-logo">
            <Logo />
          </div>
          <h1>Room is FULL!!!!!</h1>
          <h2>Want to play Game?</h2>
          <p>Return to Home and create new room!</p>
          <Link to="/">
            <button>Return to home</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Error
