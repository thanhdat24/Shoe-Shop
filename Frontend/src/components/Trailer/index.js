import React from "react";

import { makeStyles } from "@mui/styles";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { OPEN_MODAL } from "../../redux/constants/ModalTrailer";

BtnPlay.propTypes = {
  urlYoutube: PropTypes.string,
  cssRoot: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

const useStyles = makeStyles({
  trailer: {
    color: "#2c7be5",
    backgroundColor: "transparent",
    cursor: "pointer",
    "&:hover": {
      color: "#1657af",
    },
  },
});

export default function BtnPlay({ urlYoutube }) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const openModal = () => {
    dispatch({
      type: OPEN_MODAL,
      payload: {
        open: true,
        urlYoutube,
      },
    });
  };

  return (
    <span className={classes.trailer} onClick={() => openModal()}>
      Trailer
    </span>
  );
}
