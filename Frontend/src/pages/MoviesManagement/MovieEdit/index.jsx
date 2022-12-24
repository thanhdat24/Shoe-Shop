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
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDetailMovie } from "../../../redux/actions/Movie";
import { RESET_MOVIE_DETAIL } from "../../../redux/constants/Movie";

export default function MovieEdit() {
  const { successDetailMovie } = useSelector((state) => state.MovieReducer);

  const params = useParams();
  const dispatch = useDispatch();
  useEffect(function () {
    dispatch(getDetailMovie(params.idMovie));
    return () => {
      dispatch({ type: RESET_MOVIE_DETAIL });
    };
  }, []);


  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="text.primary"fv
      href="/admin/dashboard"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Trang chủ
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="text.primary"
      href="/admin/movies/list"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Phim
    </Link>,
    <Typography key="3" color="inherit">
      Chỉnh sửa phim
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
            Chỉnh sửa phim
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Info successDetailMovie={successDetailMovie[0]} />
      </Box>
    </Container>
  );
}
