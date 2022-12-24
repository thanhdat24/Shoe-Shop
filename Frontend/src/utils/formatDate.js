import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";

const formatDate = (dateIn) => {
  // ISODate ~ 2021-3-31
  if (!dateIn) {
    return {
      dayToday: "loading...",
      dateShort: "loading...",
      dateFull: "loading...",
      dDMmYy: "loading...",
      dDMm: "loading...",
    };
  }
  if (dateIn?.indexOf("/") !== -1) {
    // if input 31/3/2021 > output 2021-3-31
    const arr = dateIn?.split("/");
    dateIn = `${arr[2]}-${arr[1]}-${arr[0]}`;
  }
  const dateObj = new Date(dateIn);
  const dayNumber = dateObj.getDay(); // trả về thứ dưới dạng một số từ 0 > 6
  const dateNowFormat = new Date().toString().slice(0, 10);
  const dateObjFormat = dateObj.toString().slice(0, 10);

  let dayToday = "";
  if (dayNumber === 0) {
    dayToday = "Chủ nhật";
  }
  if (dayNumber === 1) {
    dayToday = "Thứ 2";
  }
  if (dayNumber === 2) {
    dayToday = "Thứ 3";
  }
  if (dayNumber === 3) {
    dayToday = "Thứ 4";
  }
  if (dayNumber === 4) {
    dayToday = "Thứ 5";
  }
  if (dayNumber === 5) {
    dayToday = "Thứ 6";
  }
  if (dayNumber === 6) {
    dayToday = "Thứ 7";
  }
  if (dateNowFormat === dateObjFormat) {
    dayToday = "Hôm nay";
  }

  const date = `0${dateObj.getDate()}`.slice(-2);

  const month = `0${dateObj.getMonth() + 1}`.slice(-2);

  const year = dateObj.getFullYear();

  const dateFull = dayToday + ", " + date + " tháng " + month + ", " + year;

  const getTime = dateObj.getTime();

  return {
    dayToday,
    dateShort: dateIn,
    dateFull,
    YyMmDd: `${year}.${month}.${date}`,
    getTime,
    dDMmYy: `${date}/${month}/${year}`,
    dDMm: `${date}/${month}`,
  };
};

export default formatDate;
formatDate.propTypes = {
  ISODate: PropTypes.string.isRequired,
};

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export function calculateTimeout(dateShow) {
  const fakeThoiLuong = 120;
  const timeInObj = new Date(dateShow);
  const timeOutObj = new Date(timeInObj.getTime() + fakeThoiLuong * 60 * 1000);

  return timeOutObj.toLocaleTimeString([], { hour12: false }).slice(0, 5);
}
