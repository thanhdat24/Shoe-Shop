import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import formatDate from "../../../utils/formatDate";
import {
  Box,
  Stack,
  Card,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useFormik, Form, ErrorMessage, Formik } from "formik";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import moment from "moment";
import { resetUpdate, updateCurrentUser } from "../../../redux/actions/Auth";
import { useSnackbar } from "notistack";

export default function Info() {
  const {
    successUpdateUserCurrent,
    loadingUpdateUserCurrent,
    errorUpdateUserCurrent,
    currentUserLogin,
    currentUser: { user },
  } = useSelector((state) => state.AuthReducer);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [isReadyUpdateUserInfo, setIsReadyUpdateUserInfo] = useState(false);
  const totalPaymentAmount = currentUserLogin?.bookingHistory?.length;
  const totalComment = currentUserLogin?.commentList?.length;
  const totalPrice = currentUserLogin?.bookingHistory?.reduce(
    (total, ticket) => {
      return total + ticket.totalPrice;
    },
    0
  );

  const commentLike = currentUserLogin?.commentList?.reduce(
    (total, comment) => {
      return total + comment.likes;
    },
    0
  );

  useEffect(() => {
    return () => {
      dispatch(resetUpdate());
    };
  }, []);

  const phoneRegExp =
    /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

  const UpdateSchema = Yup.object().shape({
    fullName: Yup.string().required("*Họ tên không được bỏ trống !"),
    email: Yup.string()
      .required("*Email không được bỏ trống !")
      .email("* Email không hợp lệ "),
    phoneNumber: Yup.string()
      .required("*Số điện thoại không được bỏ trống!")
      .matches(phoneRegExp, "Số điện thoại không hợp lệ!"),
    gender: Yup.string().required("*Giới tính không được bỏ trống!"),
    dateOfBirth: Yup.date()
      .required("*Ngày sinh không được bỏ trống!")
      .test("checkAge", "Ngày phải nhỏ hơn ngày hôm nay", (value) => {
        var today = new Date();
        return value < today;
      }),
  });
  const formik = useFormik({
    initialValues: {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      dateOfBirth: moment(user.dateOfBirth).format("YYYY-MM-DD"),
      photo: user.photo,
      remember: true,
    },

    validationSchema: UpdateSchema,
    onSubmit: (user) => {
      if (loadingUpdateUserCurrent || !isReadyUpdateUserInfo) {
        return;
      }
      dispatch(updateCurrentUser(user));
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, values } = formik;

  useEffect(() => {
    if (
      touched.fullName ||
      touched.phoneNumber ||
      touched.gender ||
      touched.dateOfBirth
    )
      setIsReadyUpdateUserInfo(true);
    else setIsReadyUpdateUserInfo(false);
  }, [
    touched.fullName,
    touched.phoneNumber,
    touched.gender,
    touched.dateOfBirth,
  ]);
  const [gender, setGender] = useState(10);
  const handleChangeGender = (event) => {
    setGender(event.target.value);
  };

  useEffect(() => {
    if (successUpdateUserCurrent) {
      setTimeout(() => {
        enqueueSnackbar("Cập nhật thành công!", { variant: "success" });
      }, 100);
      return;
    }
    if (errorUpdateUserCurrent) {
      enqueueSnackbar(errorUpdateUserCurrent, { variant: "error" });
    }
  }, [successUpdateUserCurrent, errorUpdateUserCurrent]);

  return (
    <div className="md:max-w-4xl pt-2 pb-10 mx-auto flex flex-col md:flex-row md:items-start items-center justify-between md:space-x-3">
      <div className="md:max-w-xs max-w-xl min-w-0 w-full ">
        <div className="md:max-w-xs max-w-xl min-w-0 py-4 px-3 bg-white  w-full rounded-xl shadow space-y-3 top-20 left-0 space-y-2 md:space-y-3 mb-2 block">
          <div
            className="text-lg font-semibold w-full border-b pb-2 text-green-600"
            sx={{ textAlign: "start" }}
          >
            Thông Tin Cá Nhân
          </div>
          <div className="flex flex-col space-y-2 mt-3">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Họ và tên </span>
              <span className="font-semibold max-row-2">{user.fullName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Giới tính </span>
              <span className="font-semibold max-row-2">{user.gender}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Sinh nhật </span>
              <span className="font-semibold max-row-2">
                {formatDate(user.dateOfBirth).dDMmYy}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Số điện thoại </span>
              <span className="font-semibold max-row-2">
                {user.phoneNumber}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Email </span>
              <span className="font-semibold max-row-2 break-all">
                {user.email}
              </span>
            </div>
          </div>
        </div>
        <div className="md:max-w-xs max-w-xl min-w-0 py-4 px-3 bg-white  w-full rounded-xl shadow space-y-3top-20 left-0 space-y-2 md:space-y-3 mb-2 block">
          <div
            className="text-lg font-semibold w-full border-b pb-2 text-green-600"
            sx={{ textAlign: "start" }}
          >
            Hoạt Động
          </div>
          <div className="flex flex-col space-y-2 mt-3">
            <div className="flex flex-row justify-between">
              <span className="font-semibold text-base">Bình luận</span>
              <span className="text-md text-gray-500 max-row-2">
                {totalComment}
              </span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="font-semibold text-base">
                Bình luận được thích
              </span>
              <span className="text-md text-gray-500 max-row-2">
                {commentLike}
              </span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="font-semibold text-base">Số lần thanh toán</span>
              <span className="text-md text-gray-500 max-row-2">
                {totalPaymentAmount}
              </span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="font-semibold text-base">Tổng tiền $</span>
              <span className="text-md text-gray-500 max-row-2">
                {totalPrice?.toLocaleString("vi-VI")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-xl w-full mx-auo">
        <div className="py-4 px-3 max-w-xl min-w-200 bg-white flex flex-col justify-start items-start space-y-3 rounded-xl shadow">
          <div className="text-lg font-semibold w-full border-b dark:border-dark-hover pb-2 text-green-600 dark:text-green-400">
            Chỉnh Sửa Chi Tiết Cá Nhân
          </div>
          <div className="w-full mt-3">
            <Formik value={formik}>
              <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Stack spacing={4}>
                  <TextField
                    fullWidth
                    disabled
                    autoComplete="email"
                    type="email"
                    label="Email"
                    {...getFieldProps("email")}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    autoComplete="fullName"
                    type="text"
                    label="Họ tên"
                    {...getFieldProps("fullName")}
                    error={Boolean(touched.fullName && errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                  />{" "}
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    {...getFieldProps("phoneNumber")}
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                  <FormControl
                    fullWidth
                    error={Boolean(touched.gender && errors.gender)}
                  >
                    <InputLabel id="select-gender">Giới Tính</InputLabel>
                    <Select
                      sx={{
                        display: "inline-flex",
                        textAlign: "start",
                      }}
                      labelId="select-gender"
                      id="select-gender"
                      value={gender}
                      label="Giới Tính"
                      onChange={handleChangeGender}
                      {...getFieldProps("gender")}
                    >
                      <MenuItem value={`Nam`}>Nam</MenuItem>
                      <MenuItem value={`Nữ`}>Nữ</MenuItem>
                    </Select>
                    <ErrorMessage
                      name="gender"
                      render={(msg) => (
                        <span className="text-red-600 text-xs mt-1 ml-3">
                          {msg}
                        </span>
                      )}
                    />
                  </FormControl>
                  <TextField
                    id="date"
                    label="Ngày tháng năm sinh"
                    type="date"
                    fullWidth
                    {...getFieldProps("dateOfBirth")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={Boolean(touched.dateOfBirth && errors.dateOfBirth)}
                    helperText={touched.dateOfBirth && errors.dateOfBirth}
                  />
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
                      loading={loadingUpdateUserCurrent}
                      disabled={!isReadyUpdateUserInfo}
                      sx={{
                        padding: "6px 9px",
                        fontWeight: "700",
                        lineHeight: "1.71429",
                        fontSize: "0.8rem",
                        textTransform: "capitalize",
                      }}
                    >
                      Cập nhật
                    </LoadingButton>
                  </Box>
                </Stack>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
