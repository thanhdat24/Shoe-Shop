import React, { Fragment, useEffect } from "react";
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
import Grid from "@mui/material/Grid";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import moment from "moment";
import { resetUpdate, updateCurrentUser } from "../../../redux/actions/Auth";

export default function Info() {
  const dispatch = useDispatch();
  const {
    currentUser,
    successUpdateUserCurrent,
    loadingUpdateUserCurrent,
    errorUpdateUserCurrent,
  } = useSelector((state) => state.AuthReducer);
  const { enqueueSnackbar } = useSnackbar();
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
      fullName: currentUser?.user.fullName,
      email: currentUser?.user.email,
      phoneNumber: currentUser?.user.phoneNumber,
      gender: currentUser?.user.gender,
      dateOfBirth: moment(currentUser?.user.dateOfBirth).format("YYYY-MM-DD"),
      photo: currentUser?.user.photo,
      remember: true,
    },

    validationSchema: UpdateSchema,
    onSubmit: (user) => {
      if (loadingUpdateUserCurrent) {
        return;
      }
      dispatch(updateCurrentUser(user));
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;
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

  useEffect(() => {
    return () => {
      dispatch(resetUpdate());
    };
  }, []);
  const [srcImage, setSrcImage] = useState(currentUser?.user.photo);
  const handleChangeFile = (e) => {
    let file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      // sau khi thực hiên xong lênh trên thì set giá trị có được
      setSrcImage(e.target.result);
    };
    // Đem dữ liệu file lưu vào formik
    formik.setFieldValue("photo", file);
  };
  return (
    <Fragment>
      <Box sx={{ margin: "20px 0" }}></Box>
      <Formik value={formik}>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={4}>
              <Card
                sx={{
                  borderRadius: " 16px",
                  zIndex: 0,
                  padding: " 80px 24px",
                  textAlign: "center",
                }}
              >
                <div>
                  <div className="w-36 h-36 rounded-full p-2 border-2 border-dashed border-gray-200 inline-flex">
                    <label className="w-full h-full outline-none overflow-hidden rounded-full items-center justify-center relative flex cursor-pointer">
                      <input
                        accept="image/*"
                        multiple
                        id="fileUpload"
                        type="file"
                        autoComplete="off"
                        className="w-full h-full hidden"
                        onChange={handleChangeFile}
                      />
                      <span className="overflow-hidden z-10 w-full h-full block">
                        <span className=" w-full h-full bg-cover inline-block">
                          <img
                            src={srcImage}
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        </span>
                      </span>
                      {/* <Box
                        sx={{
                          display: "flex",
                          position: "absolute",
                          alignItems: "center",
                          flexDirection: "column",
                          justifyContent: "center",
                          transition:
                            " opacity 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                          opacity: 0.72,
                          color: "rgb(255, 255, 255)",
                          backgroundColor: "rgb(22, 28, 36)",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <span>Update photo</span>
                      </Box> */}
                    </label>
                  </div>
                </div>
              </Card>
            </Grid>
            <Grid item xs={8}>
              <Card
                sx={{
                  borderRadius: " 16px",
                  zIndex: 0,
                  padding: "24px",
                }}
              >
                <Stack spacing={3}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                  </Stack>

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
                      sx={{
                        padding: "6px 9px",
                        fontWeight: "700",
                        lineHeight: "1.71429",
                        fontSize: "0.8rem",
                        textTransform: "capitalize",
                      }}
                    >
                      Lưu thay đổi
                    </LoadingButton>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </Formik>
    </Fragment>
  );
}
