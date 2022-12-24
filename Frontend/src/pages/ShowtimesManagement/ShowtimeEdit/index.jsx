import React, { Fragment, useEffect } from "react";
import {
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Tab,
  Stack,
} from "@mui/material";
import Info from "./Info";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getDetailShowtimes } from "../../../redux/actions/BookTicket";
import { RESET_SHOWTIME_DETAIL } from "../../../redux/constants/BookTicket";

export default function ShowtimeEdit() {
  const { successDetailShowtime } = useSelector(
    (state) => state.BookTicketReducer
  );
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(function () {
    dispatch(getDetailShowtimes(params.showtimeId));
    return () => {
      dispatch({ type: RESET_SHOWTIME_DETAIL });
    };
  }, []);
  // console.log("successDetailShowtime", successDetailShowtime);
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      href="/admin/dashboard"
      color="text.primary"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Trang chủ
    </Link>,
    <Link
      underline="hover"
      key="2"
      href="/admin/showtimes/list"
      color="text.primary"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Lịch chiếu
    </Link>,
    <Typography key="3" color="inherit">
      Chỉnh sửa lịch chiếu
    </Typography>,
  ];
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
            Chỉnh sửa lịch chiếu
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
        {successDetailShowtime !== "" && (
          <Info successDetailShowtime={successDetailShowtime} />
        )}
      </Box>
    </Container>
  );
}
