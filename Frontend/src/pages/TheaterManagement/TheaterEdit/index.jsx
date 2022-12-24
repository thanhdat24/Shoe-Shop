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
import { getDetailTheater } from "../../../redux/actions/Theater";
import { useParams } from "react-router-dom";
import { RESET_THEATER_DETAIL } from "../../../redux/constants/Theater";
import { getTheaterClusterList } from "../../../redux/actions/TheaterCluster";

export default function TheaterEdit() {
  const { successDetailTheater } = useSelector((state) => state.TheaterReducer);
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(function () {
    dispatch(getDetailTheater(params.theaterId));
    return () => {
      dispatch({ type: RESET_THEATER_DETAIL });
    };
  }, []);

  useEffect(() => {
    dispatch(getTheaterClusterList());
  }, []);
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
      href="/admin/theater/list"
      color="text.primary"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Rạp
    </Link>,
    <Typography key="3" color="inherit">
      Chỉnh sửa rạp
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
            Chỉnh sửa rạp
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
        {successDetailTheater && (
          <Info successDetailTheater={successDetailTheater} />
        )}
      </Box>
    </Container>
  );
}
