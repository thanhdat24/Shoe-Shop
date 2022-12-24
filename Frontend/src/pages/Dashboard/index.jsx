import { Box, Container, Grid } from "@mui/material";
import _ from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMovieList } from "../../redux/actions/Movie";
import { getTheaterList } from "../../redux/actions/Theater";
import { AppTheaterCluster, AppWidgetSummary } from "../../sections/dashboard";
import { getUsersList } from "../../redux/actions/Users";
import {
  getAllTicket,
  getMovieRevenue,
  getRevenueByDay,
  getTicketRevenue,
} from "../../redux/actions/BookTicket";
import AppMovie from "../../sections/dashboard/AppMovie";
import AppDay from "../../sections/dashboard/AppDay";

export default function Dashboard() {
  const { movieList } = useSelector((state) => state.MovieReducer);
  const { theaterList } = useSelector((state) => state.TheaterReducer);
  const { usersList } = useSelector((state) => state.UserManagement);
  const { ticketList, ticketRevenue, movieRevenue, dayRevenue } = useSelector(
    (state) => state.BookTicketReducer
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      !movieList?.result ||
      !theaterList?.result ||
      !usersList?.result ||
      !ticketList?.result ||
      !ticketRevenue?.result ||
      !movieRevenue?.result ||
      !dayRevenue?.result
    ) {
      dispatch(getMovieList());
      dispatch(getTheaterList());
      dispatch(getUsersList());
      dispatch(getAllTicket());
      dispatch(getTicketRevenue());
      dispatch(getMovieRevenue());
      dispatch(getRevenueByDay());
    }
  }, []);

  // Lọc phim đang chiếu
  let dailyMovieList = _.filter(movieList?.data, ["nowShowing", true]);

  // movieList?.data?.filter((item) => item.nowShowing === true);
  return (
    <Box sx={{ mt: 15 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Phim Chiếu Rạp"
              total={dailyMovieList.length}
              icon={"bxs:camera-movie"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Cụm Rạp"
              total={theaterList?.result}
              color="info"
              icon={"mdi:theater"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Thành Viên"
              total={usersList?.result}
              color="warning"
              icon={"fa-solid:users"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Vé Đã Bán"
              total={ticketList?.result}
              color="error"
              icon={"bi:ticket-perforated-fill"}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} md={12} lg={12} sx={{ mt: 5 }}>
          <AppTheaterCluster />
        </Grid>
        <Grid item xs={12} md={12} lg={12} sx={{ mt: 5 }}>
          <AppMovie />
        </Grid>
        <Grid item xs={12} md={12} lg={12} sx={{ mt: 5 }}>
          <AppDay />
        </Grid>
      </Container>
    </Box>
  );
}
