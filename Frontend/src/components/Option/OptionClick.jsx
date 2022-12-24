import { LoadingButton } from "@mui/lab";
import { Box, Button } from "@mui/material";
import React from "react";
import { useStyles } from "./styles";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

Option.propTypes = {
  onClickHistory: PropTypes.func,
  disabledButton: PropTypes.bool,
  loadingButton: PropTypes.bool,
  title: PropTypes.string,
};

export default function OptionClick({
  onClickHistory,
  disabledButton,
  loadingButton,
  title,
}) {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Box className={classes.formActionBar}>
      <Box className={classes.ActionWrapper}>
        <Button
          sx={{
            color: "gray",
            borderColor: "gray ",
            "&:hover": { color: "primary.main" },
          }}
          variant="outlined"
          onClick={() => history.push(onClickHistory)}
          className={classes.buttonCreate}
        >
          Huỷ
        </Button>
        <LoadingButton
          size="large"
          variant="contained"
          disabled={!disabledButton}
          className={classes.buttonCreate}
          loading={loadingButton}
          type="submit"
        >
          {title}
        </LoadingButton>
      </Box>
    </Box>
  );
}
