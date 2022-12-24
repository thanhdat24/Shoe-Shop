import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import paymentApi from "../../../api/paymentApi";
import { postCreateTicket } from "../../../redux/actions/BookTicket";

export default function MoMo({ idShowtime, amount, successMoMo }) {
  const {
    seatCodes,
    discount,
    danhSachPhongVe: { data },
    listSeatSelected,
  } = useSelector((state) => state.BookTicketReducer);
  const [linkMoMo, setLinkMoMo] = useState("");
  const checkoutLinkRef = useRef();
  const dispatch = useDispatch();
  const handleClickMomo = async () => {
    const { data } = await paymentApi.createPaymentMoMo({
      _id: idShowtime,
      total: amount - discount,
    });
    console.log("data", data);
    localStorage.setItem("createPaymentMoMo", JSON.stringify(data));

    // riderect to momo website
    setLinkMoMo(data.qrCodeUrl);
    checkoutLinkRef.current.click();
  };

  let itemBooking = {
    discount: discount,
    amountTicket: seatCodes.length,
    ticketPrice: data.ticketPrice * seatCodes.length - discount,
    idShowtime,
    seatCodes,
    listSeatSelected,
    status: true,
  };

  localStorage.setItem("itemBooking", JSON.stringify(itemBooking));

  return (
    <>
      <Button
        style={{
          position: "relative",
          marginTop: "8px",
          borderColor: "rgb(190 24 93/1)",
          backgroundColor: "rgb(190 24 93/1)",
          color: " rgb(255 255 255/0.95)",
          fontWeight: 700,
          borderRadius: " 0.5rem",
          padding: " 0.5rem 1.25rem",
          fontSize: "1rem",
          lineHeight: " 1.5rem",
          "&:hover": {
            backgroundColor: "red",
          },
        }}
        onClick={handleClickMomo}
        type="submit"
      >
        Thanh toán bằng ví MoMo
      </Button>

      <a ref={checkoutLinkRef} style={{ display: "none" }} href={linkMoMo}>
        checkout momo
      </a>
    </>
  );
}
