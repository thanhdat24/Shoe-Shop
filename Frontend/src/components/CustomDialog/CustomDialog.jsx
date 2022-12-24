import { Dialog } from "@mui/material";
import React from "react";
import useStyles from "./style";
import PropTypes from "prop-types";



export default function CustomDialog(props) {
  const { open, handleClose, dialogSize, children} = props;
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={dialogSize}
      BackdropProps={{
        classes: {
          root: classes.backDrop,
        },
      }}
    >
      {children}
    </Dialog>
  );
}
CustomDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  dialogSize: PropTypes.string,
  children: PropTypes.node,
};