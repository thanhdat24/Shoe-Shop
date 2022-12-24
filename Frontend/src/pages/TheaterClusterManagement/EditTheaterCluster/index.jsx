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
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getDetailTheaterCluster } from "../../../redux/actions/TheaterCluster";
import { RESET_THEATER_CLUSTER_DETAIL } from "../../../redux/constants/TheaterCluster";
import Info from "./Info";
import { getTheaterSystemList } from "../../../redux/actions/TheaterSystem";

export default function EditTheaterCluster() {
  const { successDetailTheaterCluster } = useSelector(
    (state) => state.TheaterClusterReducer
  );
  const { theaterSystemList } = useSelector(
    (state) => state.TheaterSystemReducer
  );
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(function () {
    dispatch(getDetailTheaterCluster(params.theaterClusterId));
    return () => {
      dispatch({ type: RESET_THEATER_CLUSTER_DETAIL });
    };
  }, []);
  useEffect(() => {
    dispatch(getTheaterSystemList());
  }, []);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="text.primary"
      fv
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
      Cụm rạp
    </Link>,
    <Typography key="3" color="inherit">
      Chỉnh sửa cụm rạp
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
            Chỉnh sửa cụm rạp
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
        {successDetailTheaterCluster && theaterSystemList && (
          <Info successDetailTheaterCluster={successDetailTheaterCluster} />
        )}
      </Box>
    </Container>
  );
}
