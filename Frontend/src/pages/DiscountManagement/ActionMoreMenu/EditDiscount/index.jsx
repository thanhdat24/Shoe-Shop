import React, { Fragment, useEffect } from "react";
import {
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Tab,
  Stack,
  Chip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getDetailDiscount } from "../../../../redux/actions/Discount";
import Info from "./info";
import { useStyles } from "../../styles";
import { RESET_DISCOUNT_DETAIL } from "../../../../redux/constants/Discount";

export default function DiscountEdit() {
  const { successDetailDiscount } = useSelector(
    (state) => state.DiscountReducer
  );
  const classes = useStyles();

  const params = useParams();
  const dispatch = useDispatch();
  useEffect(function () {
    dispatch(getDetailDiscount(params.discountId));
    return () => {
      dispatch({ type: RESET_DISCOUNT_DETAIL });
    };
  }, []);

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
      href="/admin/movies/list"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Mã giảm giá
    </Link>,
    <Typography key="3" color="inherit">
      Chi tiết mã giảm giá
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
            <img
              style={{
                filter: "brightness(0) saturate(100%)",
                width: 25.5,
                height: 24.5,
              }}
              className="inline-block mr-1"
              src="../../../img/admin/discount/icon-coupon.svg"
              alt="iconImage"
            />{" "}
            Chi tiết mã giảm giá
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
          <Box>
           <span className="mr-3"> Trạng thái:{" "}</span>
            {successDetailDiscount?.activeCode === "Sắp diễn ra" ? (
              <Chip
                label={successDetailDiscount?.activeCode}
                variant="outlined"
                className={classes.labelComingSoon}
              />
            ) : successDetailDiscount?.activeCode === "Đang diễn ra" ? (
              <Chip
                label={successDetailDiscount?.activeCode}
                variant="outlined"
                className={classes.labelNowShowing}
              />
            ) : (
              <Chip
                label="Kết thúc"
                variant="outlined"
                className={classes.labelEnd}
              />
            )}
          </Box>
        </Stack>
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Info successDetailDiscount={successDetailDiscount} />
      </Box>
    </Container>
  );
}
