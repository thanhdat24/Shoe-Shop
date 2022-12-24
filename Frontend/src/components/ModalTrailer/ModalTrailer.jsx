import React from "react";

import { useDispatch, useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import { makeStyles } from "@mui/styles";

import { CLOSE_MODAL } from "../../redux/constants/ModalTrailer";
import getVideoId from "../../utils/getVideoIdFromUrlYoutube";

const useStyles = makeStyles((theme) => ({
  paper: {
    overflowY: "visible",
    backgroundColor: "black",
  },
  iframe: {
    width: "898px",
    height: "500px",
    [theme.breakpoints.down("lg")]: {
      width: "598px",
      height: "336px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "fit-content",
      height: "fit-content",
    },
  },
}));

export default function ModalTrailer() {
  const { open, urlYoutube } = useSelector(
    (state) => state.ModalTrailerReducer
  );
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleClose = () => {
    dispatch({ type: CLOSE_MODAL, payload: { open: false } });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      classes={{ paper: classes.paper }}
    >
      <iframe
        className={classes.iframe}
        src={`https://www.youtube.com/embed/${getVideoId(
          urlYoutube
        )}?autoplay=1`}
        allowFullScreen
        frameBorder="0"
        allow="autoplay"
        title="trailer movie"
      ></iframe>
    </Dialog>
  );
}
