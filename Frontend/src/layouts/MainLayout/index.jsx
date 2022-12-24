import React from "react";

import ScrollToTop from "react-scroll-up";
import { SnackbarProvider } from "notistack";

import { makeStyles } from "@mui/styles";
import Footer from "./Footer";
import Header from "./Header";

const useStyles = makeStyles((theme) => ({
  top: {
    marginTop: 64,
    [theme.breakpoints.down("xs")]: {
      marginTop: 56,
    },
  },
  styleScrollToTop: {
    position: "fixed",
    bottom: 30,
    right: 10,
    transitionTimingFunction: "linear",
    width: 50,
    transform: "rotate(180deg)",
    zIndex: 5000,
  },
}));
export default function MainLayout(props) {
  const classes = useStyles();

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Header />
      <div className={classes.top}></div>
      {props.children}
      <Footer />
      <ScrollToTop showUnder={160}>
        <img
          src="/img/logoTixLoading.png"
          alt="totop"
          className={classes.styleScrollToTop}
        />
      </ScrollToTop>
    </SnackbarProvider>
  );
}
