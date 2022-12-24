import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postCreateTicket } from "../../../redux/actions/BookTicket";
import formatDate, { calculateTimeout } from "../../../utils/formatDate";

export default function Paypal() {
  const {
    seatCodes,
    idShowtime,
    discount,
    danhSachPhongVe: { data },
    paymentMethod,
    listSeatSelected,
  } = useSelector((state) => state.BookTicketReducer);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  if (error) {
    alert(error);
  }
  let itemBooking = {
    discountPayPal: (discount * 0.00004).toFixed(2),
    discount: discount,
    amountTicket: seatCodes.length,
    listSeatSelected,
    ticketPricePayPal: (data.ticketPrice * 0.00004).toFixed(2),
    ticketPrice: data.ticketPrice,
    paymentMethod,
    data,
    status: true,
  };
  const [successPayPal, setSuccessPayPal] = useState(false);
  const [dataFocus, setDataFocus] = useState({ phone: false, email: false });

  useEffect(() => {
    if (successPayPal) {
      console.log("idShowtime456", idShowtime);
      console.log("seatCodes456", seatCodes);
      console.log("discount456", discount);
      dispatch(postCreateTicket({ idShowtime, seatCodes, discount }));
    }
  }, [successPayPal]);
  localStorage.setItem("itemBooking", JSON.stringify(itemBooking));
  let item = JSON.parse(localStorage.getItem("itemBooking"));


  return (

      <PayPalScriptProvider>
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  // reference_id: 1234,
                  description: "Booking Ticket",
                  amount: {
                    currency_code: "USD",

                    value:
                      item.ticketPricePayPal * item.amountTicket -
                      item.discountPayPal,
                    breakdown: {
                      item_total: {
                        currency_code: "USD",
                        value: item.ticketPricePayPal * item.amountTicket,
                      },
                      // shipping: { currency_code: "USD", value: 1 },
                      // tax_total: { currency_code: "USD", value: "1.4" },
                      discount: {
                        currency_code: "USD",
                        value: item.discountPayPal,
                      },
                    },
                  },
                  items: [
                    {
                      name: `x Vé xem phim ${item.data.movieName} - ${
                        item.data.theaterClusterName
                      } - ${calculateTimeout(item.data.dateShow)} ${
                        formatDate(item.data.dateShow).dDMmYy
                      }`,
                      unit_amount: {
                        currency_code: "USD",
                        value: item.ticketPricePayPal,
                      },
                      // tax: {
                      //   currency_code: "USD",
                      //   value: 0,
                      // },
                      quantity: item.amountTicket,
                      // sku: "OnePlus61",
                      // category: "PHYSICAL_GOODS",
                    },
                  ],
                  shipping: {
                    address: {
                      address_line_1: "Khu II, Đ. 3/2, Xuân Khánh, Ninh Kiều",
                      address_line_2: "KTX Đại học cần thơ",
                      admin_area_2: "Cần Thơ",
                      admin_area_1: "Ô Môn",
                      postal_code: "94000",
                      country_code: "GB",
                    },
                  },
                },
              ],
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              setSuccessPayPal(true);
            });
          }}
          onCancel={() => {}}
          onError={(err) => {
            setError(err);
            console.log("Paypal Checkout onError", err);
          }}
        />
      </PayPalScriptProvider>

  );
}
