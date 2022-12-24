import React, { useEffect } from "react";

import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ResultBookticket from "../ResultBookticket";
import useStyles from "./style";
import { Button, Dialog } from "@mui/material";
import { getListSeat } from "../../../redux/actions/BookTicket";
import {
  RESET_ALERT_OVER10,
  RESET_DATA_BOOKTICKET,
} from "../../../redux/constants/BookTicket";

export default function Modal(props) {
  const { successBookingTicket, errorBookTicket, timeOut, alertOver10 } =
    useSelector((state) => state.BookTicketReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const classes = useStyles();
  const isBookTicket = successBookingTicket || errorBookTicket ? true : false;
  const handleReBooking = () => {
    if (
      successBookingTicket ||
      errorBookTicket ||
      queryPaymentMoMo?.resultCode === 1006 ||
      queryPaymentMoMo?.resultCode === 0
    ) {
      dispatch(getListSeat(params.idShowtime));
    }
    localStorage.removeItem("createPaymentMoMo");
    localStorage.removeItem("queryPaymentMoMo");
    localStorage.removeItem("itemBooking");

    dispatch({ type: RESET_DATA_BOOKTICKET });
  };
  const handleTimeOut = () => {
    dispatch({ type: RESET_DATA_BOOKTICKET });
    dispatch(getListSeat(params.idShowtime));
  };
  const handleAlertOver10 = () => {
    dispatch({ type: RESET_ALERT_OVER10 });
  };

  const handleCombackHome = () => {
    dispatch({ type: RESET_DATA_BOOKTICKET });
    // dispatch({ type: LOADING_BACKTO_HOME });
    history.push("/");
  };

  const queryPaymentMoMo = JSON.parse(localStorage.getItem("queryPaymentMoMo"));

  return (
    <Dialog
      open={timeOut || isBookTicket || alertOver10 || queryPaymentMoMo}
      classes={{ paper: classes.modal }}
      maxWidth="md"
    >
      {timeOut &&
        !isBookTicket && ( // không thông báo hết giờ khi đã có kết quả đặt vé
          <div className={classes.padding}>
            <p>
              Giữ ghế chỉ có 10 phút thôi, bạn đã chậm tay mất rồi. Vui lòng
              chọn lại ghế bạn thích nha.
              <span className={classes.txtClick} onClick={handleTimeOut}>
                &nbsp;Đặt vé lại
              </span>
            </p>
          </div>
        )}
      {alertOver10 &&
        !timeOut && ( // ẩn thông báo quá 10 ghế khi time out
          <div className={classes.over10}>
            <div className={classes.notification}>
              <img
                width="100%"
                src="/img/bookticket/Post-notification.png"
                alt="Post-notification"
              />
            </div>
            <p className={classes.textOver}>Bạn không thể chọn quá 10 ghế</p>
            <Button
              variant="outlined"
              classes={{ root: classes.btnOver }}
              onClick={handleAlertOver10}
            >
              ok
            </Button>
          </div>
        )}
      {(isBookTicket || queryPaymentMoMo) && ( // chỉ open modal khi là desktop và đã đạt vé
        <>
          <ResultBookticket
            socket={props.socket}
            queryPaymentMoMo={queryPaymentMoMo}
          />
          <div className={classes.spaceEvenly}>
            <Button
              classes={{ root: classes.btnResult }}
              onClick={handleReBooking}
            >
              {(successBookingTicket || queryPaymentMoMo?.resultCode === 0) &&
                "Mua thêm vé phim này"}
              {(errorBookTicket || queryPaymentMoMo?.resultCode === 1006) &&
                "Thử mua lại"}
            </Button>
            <Button
              classes={{ root: classes.btnResult }}
              onClick={handleCombackHome}
            >
              Quay về trang chủ
            </Button>
          </div>
        </>
      )}
    </Dialog>
  );
}
