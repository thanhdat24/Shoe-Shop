import React from "react";
import ListSeat from "../ListSeat";
import PayMent from "../PayMent";

import StepCheckout from "./StepCheckout";
import useStyles from "./style";
export default function Index(props) {
  const classes = useStyles();

  return (
    <div className={classes.bookTicked}>
      <section className={classes.left}>
        <StepCheckout />
        <ListSeat socket={props.socket} />
      </section>
      <section className={classes.right}>
        <PayMent socket={props.socket} />
      </section>
    </div>
  );
}
