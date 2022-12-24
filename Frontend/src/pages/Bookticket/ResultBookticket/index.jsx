import React, { useEffect } from "react";
import { colorTheater } from "../../../constants/theaterData";

import { useDispatch, useSelector } from "react-redux";

import useStyles from "./style";
import formatDate, { calculateTimeout } from "../../../utils/formatDate";

export default function SuccessBooking({ queryPaymentMoMo }) {
  const {
    amount,
    email,
    phone,
    discount,
    paymentMethod,
    danhSachPhongVe: { data },
    listSeatSelected,
    successBookingTicket,
    errorBookTicket,
  } = useSelector((state) => state.BookTicketReducer);
  const { currentUser } = useSelector((state) => state.AuthReducer);
  const dispatch = useDispatch();
  const classes = useStyles({
    data,
    color: colorTheater[data?.theaterClusterName.slice(0, 3).toUpperCase()],
  });
  let item = JSON.parse(localStorage.getItem("itemBooking"));

  return (
    <div className={classes.resultBookticket}>
      <div className={classes.infoTicked}>
        <div className={classes.infoTicked__img}></div>
        <div className={classes.infoTicked__txt}>
          <p className={classes.tenPhim}>{data?.movieName}</p>
          <p className={classes.text__first}>
            <span>{data?.theaterClusterName.split("-")[0]}</span>
            <span className={classes.text__second}>
              -{data?.theaterClusterName.split("-")[1]}
            </span>
          </p>
          <p className={classes.diaChi}>{data?.address}</p>
          <table className={classes.table}>
            <tbody>
              <tr>
                <td valign="top">Suất chiếu:</td>
                <td valign="top">{`${calculateTimeout(data?.dateShow)} ${
                  formatDate(data?.dateShow).dDMmYy
                }`}</td>
              </tr>
              <tr>
                <td valign="top">Phòng chiếu:</td>
                <td>{data?.theaterName}</td>
              </tr>
              <tr>
                <td valign="top">Ghế:</td>
                <td>
                  {item?.status
                    ? item.listSeatSelected?.join(", ")
                    : listSeatSelected?.join(", ")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div>
          <h3 className={classes.infoResult_label}>
            {queryPaymentMoMo?.resultCode === 1006 ? (
              <span className="text-red-500 font-bold text-3xl">
                THANH TOÁN THẤT BẠI
              </span>
            ) : (
              "Thông tin đặt vé"
            )}
          </h3>
          <table className={`${classes.table} table`}>
            <tbody>
              <tr>
                <td valign="top">Họ tên:</td>
                <td>{currentUser?.user.fullName}</td>
              </tr>
              <tr>
                <td valign="top">Điện thoại:</td>
                <td valign="top">{phone}</td>
              </tr>
              <tr>
                <td valign="top">Email:</td>
                <td>{email}</td>
              </tr>
              <tr>
                <td valign="top">Trạng thái:</td>
                <td>
                  {(successBookingTicket ||
                    queryPaymentMoMo?.resultCode === 0) && (
                    <span>
                      Đặt vé thành công qua{" "}
                      <span className={classes.paymentColor}>
                        {item?.status ? item.paymentMethod : paymentMethod}
                      </span>
                    </span>
                  )}
                  {(errorBookTicket ||
                    queryPaymentMoMo?.resultCode === 1006) && (
                    <span>
                      Đặt vé thất bại:{" "}
                      <span className={classes.errorColor}>
                        {errorBookTicket}
                      </span>
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td valign="top">Khuyến mãi:</td>
                <td valign="top">
                  <b>{`${
                    item?.status
                      ? (item.discount*1).toLocaleString("vi-VI")
                      : (discount * 1).toLocaleString("vi-VI")
                  } đ`}</b>
                </td>
              </tr>
              <tr>
                <td valign="top">Tổng tiền:</td>
                <td valign="top">
                  <span className="text-lg">
                    <b>{`${
                      item?.status
                        ? item.ticketPrice.toLocaleString("vi-VI")
                        : (amount - discount).toLocaleString("vi-VI")
                    } đ`}</b>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          {(successBookingTicket || queryPaymentMoMo?.resultCode === 0) && (
            <p className={classes.noteresult}>
              Kiểm tra lại vé đã mua trong thông tin tài khoản của bạn !
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
