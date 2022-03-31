import React from "react"
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  makeStyles,
  Modal,
  Button,
} from "@material-ui/core"

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
})

const Instructions = () => {
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleOpen}>
        How to play
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Card
          className={classes.root}
          style={{
            position: "absolute",
            marginTop: "200px",
            marginLeft: "500px",
            border: " solid",
            borderColor: "black",
          }}
        >
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                How to play
              </Typography>
              <Typography variant="body2" color="textSecondary" component="ul">
                <li>Create a room</li>
                <li>
                  After creating the room, copy and share the link to your
                  friends. You can add up to 4 players!
                </li>
                <li>
                  When you get a word right, it will cross itself out and appear
                  on everyone's screens!{" "}
                  <b>
                    Nothing you type will appear on your friend's screens until
                    the whole word is correct.
                  </b>
                </li>
                <li>
                  Every word will net you 100 points, but be careful: every word
                  you reveal also makes it easier for your friends to score!
                </li>
                <li>
                  The game ends when the crossword is finished or the timer runs
                  out, then the winner is decided!
                </li>
                <li>
                  Now that you know how to play, start a game and fight to the
                  DEATH{" "}
                  <img
                    style={{ height: 40, width: 40 }}
                    src="data:image/jpeg;base64,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"
                  />
                </li>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Modal>
    </div>
  )
}

export default Instructions
