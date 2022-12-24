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
import { useHistory } from "react-router-dom";

import theatersClusterApi from "../../../api/theatersClusterApi";
import theatersSystemApi from "../../../api/theatersSystemApi";
import {
  createShowtime,
  resetCreateShowtime,
} from "../../../redux/actions/BookTicket";
import {
  getMovieList,
  resetMoviesManagement,
} from "../../../redux/actions/Movie";
import { getAllShowTimes } from "../../../redux/actions/Theater";

export default function CreateShowtimes() {
  const { loadingCreateShowtime, successCreateShowtime, errorCreateShowtime } =
    useSelector((state) => state.BookTicketReducer);
  const dispatch = useDispatch();
  const history = useHistory();
  const { movieList } = useSelector((state) => state.MovieReducer);
  const [selectedDate, setSelectedDate] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState({
    setMovie: "",
    theaterSystemRender: [],
    theaterClusterRender: [],
    theaterRender: [],

    setTheater: "",
    setTheaterSystem: "",
    setTheaterCluster: "",

    dateShow: null,

    setTicketPrice: "",
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
  const [isReadyTaoLichChieu, setIsReadyTaoLichChieu] = useState(false);

  useEffect(() => {
    if (
      data.setMovie &&
      data.dateShow &&
      data.idTheater &&
      data.setTicketPrice &&
      data.setTheaterSystem &&
      data.setTheaterCluster
    )
      setIsReadyTaoLichChieu(true);
    else setIsReadyTaoLichChieu(false);
  }, [
    data.setMovie,
    data.dateShow,
    data.idTheater,
    data.setTicketPrice,
    data.setTheaterSystem,
    data.setTheaterCluster,
  ]);
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="text.primary"
      href="/admin/dashboard"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Trang chủ
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="text.primary"
      href="/admin/showtimes/list"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Lịch chiếu
    </Link>,
    <Typography key="3" color="inherit">
      Lịch chiếu mới
    </Typography>,
  ];

  useEffect(() => {
    // get list user lần đầu
    // if (!movieList.result) {
    dispatch(getMovieList());
    // }
    return () => dispatch(resetMoviesManagement());
  }, []);

  useEffect(() => {
    // get list user lần đầu
    // if (!showtimesList.result) {
    dispatch(getAllShowTimes());
    // }
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
    const isOpenTheaterSystem = data.setTheaterSystem ? false : true;
    setData((data) => ({
      ...data,
      setMovie: e.target.value,
      startRequest: true,
      openCtr: {
        ...data.openCtr,
        theaterSystem: isOpenTheaterSystem,
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
      idTheaterSystem: e.target.value._id,
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
      idTheaterCluster: e.target.value._id,
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

  const handleTaoLichChieu = () => {
    if (loadingCreateShowtime || !isReadyTaoLichChieu) {
      // khi đang gửi requet hoặc chưa sẵn sàng thì không cho dispatch
      return;
    }
    dispatch(
      createShowtime({
        idMovie: data.setMovie,
        dateShow: data.dateShow,
        idTheater: data.idTheater,
        idTheaterSystem: data.idTheaterSystem,
        idTheaterCluster: data.idTheaterCluster,
        ticketPrice: data.setTicketPrice,
      })
    );
  };

  useEffect(() => {
    if (successCreateShowtime) {
      setTimeout(() => {
        history.push("/admin/showtimes/list");
      }, 250);
      setTimeout(() => {
        enqueueSnackbar("Thêm lịch chiếu thành công!", { variant: "success" });
      }, 150);
      return () => dispatch(resetCreateShowtime());
    }
    if (errorCreateShowtime) {
      enqueueSnackbar(errorCreateShowtime, { variant: "error" });
    }
  }, [successCreateShowtime, errorCreateShowtime]);

  useEffect(() => {
    return () => {
      dispatch(resetMoviesManagement());
    };
  }, []);
  return (
    <Container
      sx={{ paddingRight: "0px !important", paddingLeft: "0px !important" }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
        mt={7.5}
      >
        <Stack spacing={2}>
          <Typography variant="h4" gutterBottom>
            Tạo lịch chiếu
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
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
                        {movieList.data
                          ?.filter((item) => item.nowShowing)
                          .map((movie) => (
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
                        {data.theaterClusterRender?.data?.idTheaterCluster.map(
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
                      <InputLabel id="selectTicketPrice">
                        Chọn giá vé
                      </InputLabel>
                      <Select
                        labelId="selectTicketPrice"
                        id="selectTicketPrice"
                        label="Chọn giá vé"
                        open={data.openCtr.ticketPrice}
                        onClose={handleCloseTicketPrice}
                        onOpen={handleOpenTicketPrice}
                        onChange={handleSelectTicketPrice}
                        value={data.setTicketPrice}
                        renderValue={(value) =>
                          `${value ? value + " vnđ" : ""}`
                        }
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
                      loading={loadingCreateShowtime}
                      sx={{
                        padding: "6px 9px",
                        fontWeight: "700",
                        lineHeight: "1.71429",
                        fontSize: "0.8rem",
                        textTransform: "capitalize",
                      }}
                      disabled={!isReadyTaoLichChieu}
                      onClick={handleTaoLichChieu}
                    >
                      Tạo lịch chiếu
                    </LoadingButton>
                  </Box>
                </Stack>
              </Card>
            </Grid>
            <Grid item xs></Grid>
          </Grid>
        </Fragment>
      </Box>
    </Container>
  );
}
