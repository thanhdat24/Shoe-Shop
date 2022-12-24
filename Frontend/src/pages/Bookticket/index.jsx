import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Desktop from "./Desktop/";
import Modal from "./Modal/";
import { useParams } from "react-router-dom";
import {
  getDetailShowtimes,
  getListSeat,
} from "../../redux/actions/BookTicket";
import {
  INIT_DATA,
  RESET_DATA_BOOKTICKET,
} from "../../redux/constants/BookTicket";
import { getDiscountsList } from "../../redux/actions/Discount";
import io from "socket.io-client";
import { HOST } from "../../constants/config";
import { USER_BOOKING } from "../../redux/constants/Users";
import _ from "lodash";
import { socket } from "../../utils/helper";

export default function BookTickets(props) {
  const {
    danhSachPhongVe: { data },
    danhSachPhongVe: { seatList },
    timeOut,
    refreshKey,
    errorGetListSeatMessage,
    successBookingTicket,
  } = useSelector((state) => state.BookTicketReducer);
  const { currentUser } = useSelector((state) => state.AuthReducer);
  const { user } = currentUser;
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDiscountsList());
    dispatch(getListSeat(params.idShowtime));
    socket.current = io(HOST);
    // socket.current.on("send message from server to client", (mess) => {
    //   console.log("mess", mess);
    // });

    socket.current.emit(
      "user join booking from client to server",
      params.idShowtime,
      user
    );

    // Có 1 client nào thực hiệN việc đặt vé thành công
    // socket.current.on(
    //   "send listSeat from server to client",
    //   (idShowtime, danhSachGheDangDat) => {
    //     dispatch(getListSeat(idShowtime));

    //   }
    // );

    // xử lý user list
    socket.current.on(
      "send userList from server to client",
      (userListBooking) => {
        console.log("userListBooking", userListBooking);
        dispatch({
          type: USER_BOOKING,
          payload: {
            userListBooking,
          },
        });
      }
    );

    socket.current.on(
      "send danhSachGheDangDat from server to client",
      (danhSachGheDangDat) => {
        // B1: Loại bỏ mình ra khỏi ds dang dat
        danhSachGheDangDat = danhSachGheDangDat.filter(
          (item) => item.fullName !== user?.fullName
        );

        // B2 gôpk danh sách ghế khách đặt ở tất cả user thành 1 mảng chung
        let arrGheKhachDat = danhSachGheDangDat.reduce(
          (result, item, index) => {
            let arrGhe = item.danhSachGheDangDat;

            return [...result, ...arrGhe];
          },
          []
        );
        // Check mã ghế trùng nhau
        arrGheKhachDat = _.uniqBy(arrGheKhachDat, "id");

        // Đưa dữ liệu ghế khách đặt về redux
        dispatch({
          type: "DAT_GHE",
          arrGheKhachDat,
        });
      }
    );

    return () => {
      // xóa dữ liệu khi đóng hủy component
      dispatch({ type: RESET_DATA_BOOKTICKET });
    };
  }, []);

  useEffect(() => {
    if (successBookingTicket) {
      socket.current.emit(
        "send successBookingTicket client to server",
        successBookingTicket
      );
    }
  }, [successBookingTicket]);

  useEffect(() => {
    // sau khi lấy được danhSachPhongVe thì khởi tạo data
    let initCode = 64;
    const danhSachGheEdit = seatList?.map((seat, i) => {
      // thêm label A01, thêm flag selected: false
      if (i % 16 === 0) initCode++;
      const txt = String.fromCharCode(initCode);
      const number = ((i % 16) + 1).toString().padStart(2, 0);
      return {
        ...seat,
        label: txt + number,
        selected: false,
        ticketPrice: data?.ticketPrice,
      };
    });
    dispatch({
      type: INIT_DATA,
      payload: {
        listSeat: danhSachGheEdit,
        idShowtime: data?.showtimeId,
        userName: user?.fullName,
        email: user?.email,
        phone: user?.phoneNumber,
      },
    });
  }, [seatList, currentUser, timeOut]);

  if (errorGetListSeatMessage) {
    return <div>{errorGetListSeatMessage}</div>;
  }
  return (
    <div>
      <Desktop socket={socket} key={refreshKey + 1} />
      <Modal socket={socket} {...props} />
    </div>
  );
}
