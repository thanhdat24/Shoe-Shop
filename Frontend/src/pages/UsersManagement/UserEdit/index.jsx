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
import { getDetailUser } from "../../../redux/actions/Auth";
import { RESET_CURRENT_USER } from "../../../redux/constants/Auth";

export default function UserEdit() {
  const { successGetDetailUser } = useSelector((state) => state.AuthReducer);
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(function () {
    dispatch(getDetailUser(params.userId));
    return () => {
      dispatch({ type: RESET_CURRENT_USER });
    };
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
      href="/admin/users/list"
      color="text.primary"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Người dùng
    </Link>,
    <Typography key="3" color="inherit">
      Chỉnh sửa người dùng
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
            Chỉnh sửa người dùng
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Info successGetDetailUser={successGetDetailUser} />
      </Box>
    </Container>
  );
}
