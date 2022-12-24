import React, { Fragment, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Stack,
  Grid,
  Card,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";

import theatersApi from "../../../api/theatersApi";
import {
  getDetailShowtimes,
  resetCreateShowtime,
  updateShowtime,
} from "../../../redux/actions/BookTicket";
import {
  getMovieList,
  resetMoviesManagement,
} from "../../../redux/actions/Movie";
import theatersSystemApi from "../../../api/theatersSystemApi";
import theatersClusterApi from "../../../api/theatersClusterApi";
export default function Info({ successDetailShowtime }) {
  const param = useParams();
  const { loadingUpdateShowtime, successUpdateShowtime, errorUpdateShowtime } =
    useSelector((state) => state.BookTicketReducer);
  const dispatch = useDispatch();
  console.log("successDetailShowtime", successDetailShowtime);
  const history = useHistory();
  const { movieList } = useSelector((state) => state.MovieReducer);
  var formatDateShow = moment(successDetailShowtime?.dateShow)
    .add(0, "hours")
    .format("MM/DD/YYYY hh:mm A");
  const [selectedDate, setSelectedDate] = useState(formatDateShow);
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState({
    setMovie: successDetailShowtime?.movieId,
    theaterRender: [],
    theaterSystemRender: [],
    theaterClusterRender: [],

    setTheater: successDetailShowtime?.theaterName,
    setTheaterSystem: successDetailShowtime?.theaterSystemName,
    setTheaterCluster: successDetailShowtime?.theaterClusterName,
    dateShow: formatDateShow,
    setTicketPrice: successDetailShowtime?.ticketPrice,
    ticketPriceRender: [75000, 100000, 120000, 150000],
    startRequest: false, // lựa chọn giữa hiện thị "đang tìm" hay "không tìm thấy"
    openCtr: {
      movie: false,
      theaterSystem: false,
      theaterCluster: false,
      theater: false,
      dateShow: false,
      ticketPrice: false,
    },
  });
  console.log("data", data);
  const [isReadyCapNhatLichChieu, setIsReadyCapNhatLichChieu] = useState(false);
  useEffect(() => {
    if (
      data.setMovie &&
      data.dateShow &&
      data.setTheater &&
      data.setTicketPrice &&
      data.setTheaterSystem &&
      data.setTheaterCluster
    )
      setIsReadyCapNhatLichChieu(true);
    else setIsReadyCapNhatLichChieu(false);
  }, [
    data.setMovie,
    data.dateShow,
    data.setTheater,
    data.setTicketPrice,
    data.setTheaterSystem,
    data.setTheaterCluster,
  ]);
  useEffect(() => {
    // get list user lần đầu
    if (!movieList.result) {
      dispatch(getMovieList());
    }
    // return () => dispatch(resetMoviesManagement());
  }, []);

  const handleOpenMovie = () => {
    setData((data) => ({ ...data, openCtr: { ...data.openCtr, movie: true } }));
  };
  const handleOpenTheaterSystem = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, theaterSystem: true },
    }));
  };
  const handleOpenTheaterCluster = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, theaterCluster: true },
    }));
  };
  const handleOpenTheater = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, theater: true },
    }));
  };

  const handleOpendateShow = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, dateShow: true },
    }));
  };
  const handleOpenTicketPrice = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, ticketPrice: true },
    }));
  };
  const handleCloseMovie = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, movie: false },
    }));
  };
  const handleCloseTheaterSystem = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, theaterSystem: false },
    }));
  };
  const handleCloseTheaterCluster = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, theaterCluster: false },
    }));
  };
  const handleCloseTheater = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, theater: false },
    }));
  };
  const handleClosedateShow = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, dateShow: false },
    }));
  };
  const handleCloseTicketPrice = () => {
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, ticketPrice: false },
    }));
  };

  const handleSelectMovie = (e) => {
    const isOpenTheater = data.setTheater ? false : true;
    setData((data) => ({
      ...data,
      setMovie: e.target.value,
      startRequest: true,
      openCtr: {
        ...data.openCtr,
        theater: isOpenTheater,
      },
    }));
    theatersSystemApi.getTheaterSystemList(e.target.value).then((result) => {
      setData((data) => ({
        ...data,
        theaterSystemRender: result.data,
        startRequest: false,
      }));
    });
  };
  const handleSelectTheaterSystem = async (e) => {
    setData((data) => ({
      ...data,
      setTheaterSystem: e.target.value.name,
      startRequest: true,
      openCtr: { ...data.openCtr, theaterCluster: true },
      //reset
      setTheaterCluster: "",
      theaterRender: [],
      setTheater: "",
    }));

    await theatersSystemApi
      .getDetailTheaterSystem(e.target.value._id)
      .then((result) => {
        setData((data) => ({
          ...data,
          theaterClusterRender: result.data,
          startRequest: false,
        }));
      });
  };

  const handleSelectTheaterCluster = async (e) => {
    const openTheater = data.theaterCluster ? false : true;
    setData((data) => ({
      ...data,
      setTheaterCluster: e.target.value.name,
      startRequest: true,
      openCtr: { ...data.openCtr, theater: openTheater },
      //reset
      setTheater: "",
      idTheater: "",
    }));

    await theatersClusterApi
      .getDetailTheaterCluster(e.target.value._id)
      .then((result) => {
        setData((data) => ({
          ...data,
          theaterRender: result.data,
          startRequest: false,
        }));
      });
  };
  const handleSelectTheater = (e) => {
    const opendateShow = data.dateShow ? false : true;
    setData((data) => ({
      ...data,
      setTheater: e.target.value.name,
      startRequest: true,
      openCtr: { ...data.openCtr, dateShow: opendateShow },
      idTheater: e.target.value._id,
    }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date !== "Invalid Date") {
      const obj = new Date(date);
      setData((data) => ({
        ...data,
        dateShow: `${(obj.getMonth() + 1).toString().padStart(2, 0)}/${obj
          .getDate()
          .toString()
          .padStart(2, 0)}/${obj.getFullYear()} ${obj
          .getHours()
          .toString()
          .padStart(2, 0)}:${obj.getMinutes().toString().padStart(2, 0)}:00`,
      }));
    }
  };
  const handleDateAccept = () => {
    const openTicketPrice = data.setTicketPrice ? false : true;
    setData((data) => ({
      ...data,
      openCtr: { ...data.openCtr, ticketPrice: openTicketPrice },
    }));
  };

  const handleSelectTicketPrice = (e) => {
    setData((data) => ({
      ...data,
      setTicketPrice: e.target.value,
    }));
  };

  const handleCapNhatLichChieu = () => {
    if (loadingUpdateShowtime || !isReadyCapNhatLichChieu) {
      // khi đang gửi requet hoặc chưa sẵn sàng thì không cho dispatch
      return;
    }
    dispatch(
      updateShowtime(param.showtimeId, {
        idMovie: data.setMovie,
        dateShow: data.dateShow,
        idTheater: data.idTheater,
        ticketPrice: data.setTicketPrice,
      }) // ngayChieuGioChieu phải có định dạng dd/MM/yyyy hh:mm:ss);
    );
  };

  useEffect(() => {
    if (successUpdateShowtime) {
      setTimeout(() => {
        history.push("/admin/showtimes/list");
      }, 100);
      setTimeout(() => {
        enqueueSnackbar("Cập nhật lịch chiếu thành công!", {
          variant: "success",
        });
      }, 150);
      return () => dispatch(resetCreateShowtime());
    }
    if (errorUpdateShowtime) {
      enqueueSnackbar(errorUpdateShowtime, { variant: "error" });
    }
  }, [successUpdateShowtime, errorUpdateShowtime]);
  return (
    <Container
      sx={{ paddingRight: "0px !important", paddingLeft: "0px !important" }}
    >
      <Fragment>
        <Box sx={{ margin: "20px 0" }}></Box>
        <Grid container rowSpacing={1} spacing={3}>
          <Grid item xs></Grid>
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: " 16px",
                zIndex: 0,
                padding: "24px",
              }}
            >
              <div className="mb-5 text-lg font-semibold">
                Thông tin lịch chiếu
              </div>
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="select">Chọn phim</InputLabel>
                    <Select
                      labelId="select"
                      id="select"
                      label="Chọn phim"
                      open={data.openCtr.movie} // control open
                      onClose={handleCloseMovie}
                      onOpen={handleOpenMovie}
                      onChange={handleSelectMovie} // value={phim.maPhim} tự động truyền vào handleSelectPhim sau khi chọn phim
                      value={data.setMovie} // giá trị truyền vào quyết định MenuItem nào sẽ được hiển thị sao khi chọn dựa vào value của MenuItem
                    >
                      <MenuItem
                        value=""
                        style={{
                          display: data.openCtr?.movie ? "none" : "block",
                        }}
                      >
                        Chọn Phim
                      </MenuItem>
                      {movieList.data?.map((movie) => (
                        <MenuItem
                          value={movie._id} // giá trị sẽ được đẩy lên
                          key={movie._id}
                        >
                          {movie.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="theater-system">
                      Chọn hệ thống rạp
                    </InputLabel>
                    <Select
                      labelId="theater-system"
                      id="theater-system"
                      label="Chọn hệ thống rạp"
                      open={data.openCtr.theaterSystem} // control open
                      onClose={handleCloseTheaterSystem}
                      onOpen={handleOpenTheaterSystem}
                      onChange={handleSelectTheaterSystem} // value={phim.maPhim} tự động truyền vào handleSelectPhim sau khi chọn phim
                      renderValue={(value) => `${value ? value : ""}`} // hiển thị giá trị đã chọn
                      value={data.setTheaterSystem} // giá trị truyền vào quyết định MenuItem nào sẽ được hiển thị sao khi chọn dựa vào value của MenuItem
                      displayEmpty // hiển thị item đầu tiên
                    >
                      <MenuItem
                        value=""
                        style={{
                          display:
                            data.theaterSystemRender?.result > 0
                              ? "none"
                              : "block",
                        }}
                      >
                        {data.setMovie
                          ? `${
                              data.startRequest
                                ? "Đang tìm hệ thống rạp"
                                : "Không tìm thấy, vui lòng chọn phim khác"
                            }`
                          : "Vui lòng chọn phim"}
                      </MenuItem>
                      {data.theaterSystemRender.data?.map((item) => (
                        <MenuItem
                          value={item} // giá trị sẽ được đẩy lên
                          key={item._id}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="selectTheaterCluster">
                      Chọn cụm rạp
                    </InputLabel>
                    <Select
                      labelId="selectTheaterCluster"
                      id="selectTheaterCluster"
                      label="Chọn cụm rạp"
                      open={data.openCtr.theaterCluster} // control open
                      onClose={handleCloseTheaterCluster}
                      onOpen={handleOpenTheaterCluster}
                      onChange={handleSelectTheaterCluster} // value={phim.maPhim} tự động truyền vào handleSelectPhim sau khi chọn phim
                      renderValue={(value) => `${value ? value : ""}`} // hiển thị giá trị đã chọn
                      value={data.setTheaterCluster} // giá trị truyền vào quyết định MenuItem nào sẽ được hiển thị sao khi chọn dựa vào value của MenuItem
                      displayEmpty // hiển thị item đầu tiên
                    >
                      <MenuItem
                        value=""
                        style={{
                          display:
                            data.theaterClusterRender?.length > 0
                              ? "none"
                              : "block",
                        }}
                      >
                        {data.setTheaterSystem
                          ? `${
                              data.startRequest
                                ? "Đang tìm cụm rạp"
                                : "Không tìm thấy, vui lòng chọn hệ thống rạp khác"
                            }`
                          : "Vui lòng chọn hệ thống rạp"}
                      </MenuItem>
                      {data.theaterClusterRender?.data?.theatercluster.map(
                        (item) => (
                          <MenuItem
                            value={item} // giá trị sẽ được đẩy lên
                            key={item._id}
                          >
                            {item.name}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="selectTheater">Chọn rạp</InputLabel>
                    <Select
                      labelId="selectTheater"
                      id="selectTheater"
                      label="Chọn rạp"
                      open={data.openCtr.theater} // control open
                      onClose={handleCloseTheater}
                      onOpen={handleOpenTheater}
                      onChange={handleSelectTheater} // value={phim.maPhim} tự động truyền vào handleSelectPhim sau khi chọn phim
                      renderValue={(value) => `${value ? value : ""}`} // hiển thị giá trị đã chọn
                      value={data.setTheater} // giá trị truyền vào quyết định MenuItem nào sẽ được hiển thị sao khi chọn dựa vào value của MenuItem
                      displayEmpty // hiển thị item đầu tiên
                    >
                      <MenuItem
                        value=""
                        style={{
                          display:
                            data.theaterRender?.data?.theaterList.length > 0
                              ? "none"
                              : "block",
                        }}
                      >
                        {data.setTheaterCluster
                          ? `${
                              data.startRequest
                                ? "Đang tìm rạp"
                                : "Không tìm thấy, vui lòng chọn cụm rạp khác"
                            }`
                          : "Vui lòng chọn cụm rạp"}
                      </MenuItem>
                      {data.theaterRender?.data?.theaterList?.map((item) => (
                        <MenuItem
                          value={item} // giá trị sẽ được đẩy lên
                          key={item._id}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        open={data.openCtr.dateShow}
                        onClose={handleClosedateShow}
                        onOpen={handleOpendateShow}
                        label="Ngày chiếu, giờ chiếu"
                        value={selectedDate}
                        onChange={handleDateChange}
                        onAccept={handleDateAccept}
                        format="yyyy-MM-dd, HH:mm" // HH:mm ~ 23:10, hh:mm là ~ 11:10 PM
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel id="selectTicketPrice">Chọn giá vé</InputLabel>
                    <Select
                      labelId="selectTicketPrice"
                      id="selectTicketPrice"
                      label="Chọn giá vé"
                      open={data.openCtr.ticketPrice}
                      onClose={handleCloseTicketPrice}
                      onOpen={handleOpenTicketPrice}
                      onChange={handleSelectTicketPrice}
                      value={data.setTicketPrice}
                      renderValue={(value) => `${value ? value + " vnđ" : ""}`}
                      displayEmpty
                    >
                      {data.ticketPriceRender?.map((ticketPrice) => (
                        <MenuItem
                          value={ticketPrice}
                          key={ticketPrice}
                          // classes={{
                          //   root: classes.menu__item,
                          //   selected: classes["menu__item--selected"],
                          // }}
                        >
                          {ticketPrice} vnđ
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >
                  <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={loadingUpdateShowtime}
                    sx={{
                      padding: "6px 9px",
                      fontWeight: "700",
                      lineHeight: "1.71429",
                      fontSize: "0.8rem",
                      textTransform: "capitalize",
                    }}
                    disabled={!isReadyCapNhatLichChieu}
                    onClick={handleCapNhatLichChieu}
                  >
                    Cập nhật
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs></Grid>
        </Grid>
      </Fragment>
    </Container>
  );
}
