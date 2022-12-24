import { useEffect, useState } from "react";
import Axios from "axios";
import PropTypes from "prop-types";

CheckIsIdMovieSetShowtime.propTypes = {
  idMovie: PropTypes.number.isRequired,
};
export default function CheckIsIdMovieSetShowtime(idMovie) {
  const [isIdMovieSetShowtime, setIsIdMovieSetShowtime] = useState(true);
  const url = `http://127.0.0.1:8080/api/v1/movies/${idMovie}`;
  useEffect(() => {
    let cancel = Axios.CancelToken.source(); // Axios cung cấp, để cancel gọi api khi component bị hủy(bấm chuyển cụm rạp khác)
    const loadData = async () => {
      try {
        // bắt lỗi khi get API, nếu có lỗi thì vào catch
        const response = await Axios.get(url, { cancelToken: cancel.token });
        const isIdMovieSetShowtime =
          response.data.data.showtimes.length > 0 ? true : false;
        setIsIdMovieSetShowtime(isIdMovieSetShowtime);
      } catch (error) {
        // vào đây khi có lỗi get api hoặc khi cancel thành công
        if (Axios.isCancel(error)) {
          // cancel request thành công
          console.log("AxiosCancel: caught cancel");
        } else {
          throw error; // báo lỗi get api
        }
      }
    };
    loadData();
    setTimeout(() => cancel.cancel(), 5000);
    return () => {
      cancel.cancel(); // unmounting thì cancel request axios
    };
  }, []);

  return isIdMovieSetShowtime;
}
