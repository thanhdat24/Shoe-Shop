import React, { Fragment } from "react";

import formatDate from "../../../../../utils/formatDate";
import BtnGoToCheckOut from "../../../../../components/BtnGoToCheckOut";
import useStyles from "./style";

export default function ListShowtime({ ListShowtimeByMovie }) {
  const classes = useStyles();
  const mangChiChuaNgay = ListShowtimeByMovie.map((item) => {
    // tạo mảng mới chỉ chứa ngày
    return item.dateShow.slice(0, 10); // item là "2020-12-17" cắt ra từ 2020-12-17T10:10:00
  });
  const MangNgayKhongTrungLap = [...new Set(mangChiChuaNgay)]; // xóa đi ngày trùng lặp > dùng mảng này để render số phần tử

  const filterByDay = (date) => {
    // lọc ra item từ mảng gốc
    const gioChieuRenDer = ListShowtimeByMovie.filter((item) => {
      if (item.dateShow.slice(0, 10) === date) {
        return true;
      }
      return false;
    });
    return gioChieuRenDer;
  };

  return (
    <div className={classes.lstNgayChieu}>
      {MangNgayKhongTrungLap.map((date) => (
        <Fragment key={date}>
          <p className={classes.ngayChieu}>{formatDate(date).dateFull}</p>{" "}
          {/*in ra ngày hiện tại*/}
          <div className={classes.groupTime}>
            {filterByDay(date).map((movieSchedule) => (
              <Fragment key={movieSchedule._id}>
                <BtnGoToCheckOut movieShowtimes={movieSchedule} />
              </Fragment>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
