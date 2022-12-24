import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useStyles from "./style";
import Countdown from "../Countdown";
import SquareRoundedIcon from "@mui/icons-material/SquareRounded";
import { useParams } from "react-router-dom";
import formatDate, { calculateTimeout } from "../../../utils/formatDate";
import { colorTheater } from "../../../constants/theaterData";

import {
  CHANGE_LISTSEAT,
  SET_ALERT_OVER10,
} from "../../../redux/constants/BookTicket";

export default function ListSeat(props) {
  let {
    danhSachPhongVe: { data },
    danhSachGheKhachDat,
    listSeat,
  } = useSelector((state) => state.BookTicketReducer);
  const {
    currentUser: { user },
  } = useSelector((state) => state.AuthReducer);
  const domToSeatElement = useRef(null);
  const dispatch = useDispatch();
  const param = useParams();
  const [widthSeat, setWidthSeat] = useState(0);
  const classes = useStyles({
    color: colorTheater[data?.theaterClusterName.slice(0, 3).toUpperCase()],
    modalLeftImg: data?.moviePhoto,
    widthLabel: widthSeat / 2 - 2,
  });

  useEffect(() => {
    // khởi tạo event lắng nghe "resize"
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    handleResize();
  }, [listSeat]); // sau khi có listSeat thì run handleResize để lấy giá trị đầu tiên
  const handleResize = () => {
    setWidthSeat(domToSeatElement?.current?.offsetWidth);
  };

  const handleSelectedSeat = (seatSelected) => {
    let index = danhSachGheKhachDat?.findIndex(
      (gheKD) => gheKD.id === seatSelected._id
    );
    if (seatSelected.isBooked || index !== -1) {
      // click vào ghế đã có người chọn
      return;
    }
    // đổi lại giá trị selected của ghế đã chọn

    let newListSeat = listSeat?.map((seat) => {
      if (seatSelected._id === seat._id) {
        return { ...seat, selected: !seat.selected };
      }
      return seat;
    });

    // cập nhật lại danh sách hiển thị ghế đã chọn
    const newListSeatSelected = newListSeat?.reduce(
      (newListSeatSelected, seat) => {
        if (seat.selected) {
          return [...newListSeatSelected, seat.label];
        }
        return newListSeatSelected;
      },
      []
    );

    const listSeatSelected = newListSeat?.reduce(
      (newListSeatSelected, seat) => {
        if (seat.selected) {
          return [...newListSeatSelected, { label: seat.label, id: seat._id }];
        }
        return newListSeatSelected;
      },
      []
    );

    props.socket.current.emit(
      "send danhSachGheDangDat from client to server",
      listSeatSelected,
      param.idShowtime,
      user.fullName
    );

    // thông báo nếu chọn quá 10 ghế
    if (newListSeatSelected.length === 11) {
      dispatch({
        type: SET_ALERT_OVER10,
      });
      return;
    }

    // cập nhật lại danhSachVe dùng để booking
    const seatCodes = newListSeat?.reduce((seatCodes, seat) => {
      if (seat.selected) {
        return [...seatCodes, seat.name];
      }
      return seatCodes;
    }, []);
    // console.log("newListSeat", newListSeat);
    // cập nhật biến kiểm tra đã có ghế nào được chọn chưa
    const isSelectedSeat = newListSeatSelected.length > 0 ? true : false;
    // tính lại tổng tiền

    const amount = newListSeat?.reduce((amount, seat) => {
      if (seat.selected) {
        return (amount += seat.ticketPrice);
      }
      return amount;
    }, 0);
    dispatch({
      type: CHANGE_LISTSEAT,
      payload: {
        listSeat: newListSeat,
        isSelectedSeat,
        listSeatSelected: newListSeatSelected,
        seatCodes,
        amount,
      },
    });
  };

  const color = (seat) => {
    let color = "#3e515d";
    if (seat.selected) {
      color = "#44c020";
    }
    if (seat.isBooked) {
      color = "#99c5ff";
    }
    let index = danhSachGheKhachDat?.findIndex(
      (gheKD) => gheKD.id === seat._id
    );
    if (index !== -1) {
      color = "#a50064";
    }
    return color;
  };
  return (
    <main className={classes.listSeat}>
      {/* thông tin phim */}
      <div className={classes.info_CountDown}>
        <div className={classes.infoTheater}>
          <img
            src={data?.theaterSystemLogo}
            alt="rap"
            style={{ width: 50, height: 50, borderRadius: "50%" }}
          />
          <div className={classes.text}>
            <p className={classes.text__first}>
              <span>{data?.theaterClusterName?.split("-")[0]}</span>
              <span className={classes.text__second}>
                -{data?.theaterClusterName?.split("-")[1]}
              </span>
            </p>
            <p className={classes.textTime}>{`${
              data?.movieId && formatDate(data?.dateShow).dayToday
            } - ${calculateTimeout(data?.dateShow)} - ${data?.theaterName}`}</p>
          </div>
        </div>
        <div className={classes.countDown}>
          <p className={classes.timeTitle}>Thời gian giữ ghế</p>
          <Countdown />
        </div>
      </div>
      <div className={classes.overflowSeat}>
        <div className={classes.invariantWidth}>
          {/* mô phỏng màn hình */}
          <img className="" src="/img/bookticket/screen.png" alt="screen" />
          {/* danh sách ghế */}
          <div className={classes.seatSelect}>
            {listSeat?.map((seat, i) => (
              <div
                className={classes.seat}
                key={seat._id}
                ref={domToSeatElement}
              >
                {/* label A B C ... đầu mỗi row */}
                {(i === 0 || i % 16 === 0) && (
                  <p className={classes.label}>{seat.label.slice(0, 1)}</p>
                )}

                {/* số ghế thứ tự của ghế */}
                {seat.selected && (
                  <p className={classes.seatName}>
                    {Number(seat.label.slice(1)) < 10
                      ? seat.label.slice(2)
                      : seat.label.slice(1)}
                  </p>
                )}

                {/* label ghế đã có người đặt */}
                {/* Nếu đã đặt thì thêm vào ảnh */}
                {seat.isBooked && (
                  <img
                    className={classes.seatLocked}
                    src="/img/bookticket/notchoose.png"
                    alt="notchoose"
                  />
                )}
                {/* icon ghế */}

                <SquareRoundedIcon
                  style={{ color: color(seat) }}
                  className={classes.seatIcon}
                />
                {/* đường viền chỉ vùng ghế */}
                {seat.label === "E08" && (
                  <img
                    className={classes.viewCenter}
                    src="/img/bookticket/seatcenter.png"
                    alt="seatcenter"
                  />
                )}
                {/* vùng bắt sự kiện click */}
                <div
                  className={classes.areaClick}
                  onClick={() => handleSelectedSeat(seat)}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* thông tin các loại ghế */}
      <div className={classes.noteSeat}>
        <div className={classes.typeSeats}>
          <div>
            <SquareRoundedIcon style={{ color: "#3e515d", fontSize: 27 }} />
            <p>Ghế thường</p>
          </div>
          <div>
            <SquareRoundedIcon style={{ color: "#44c020", fontSize: 27 }} />
            <p>Ghế đang chọn</p>
          </div>
          <div>
            <div style={{ position: "relative" }}>
              <SquareRoundedIcon style={{ color: "#a50064", fontSize: 27 }} />
            </div>
            <p>Ghế đang có người chọn</p>
          </div>
          <div>
            <div style={{ position: "relative" }}>
              <p className={classes.posiX}>x</p>
              <SquareRoundedIcon style={{ color: "#99c5ff", fontSize: 27 }} />
            </div>
            <p>Ghế đã được mua</p>
          </div>
        </div>
        <div className={classes.positionView}>
          <span>
            <span className={classes.linecenter} />
            <span>Ghế trung tâm</span>
          </span>
          <span className={classes.line}>
            <span className={classes.linebeautiful} />
            <span>Ghế Đẹp</span>
          </span>
        </div>
      </div>

      {/* modalleft */}
      <div className={classes.modalleft}>
        <div className={classes.opacity}></div>
      </div>
    </main>
  );
}
