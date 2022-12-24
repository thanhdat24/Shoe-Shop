import React, { Fragment, useEffect } from "react";
import { useFormik, Form, FormikProvider, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import googleFill from "@iconify/icons-eva/google-fill";
import twitterFill from "@iconify/icons-eva/twitter-fill";
import facebookFill from "@iconify/icons-eva/facebook-fill";
import { styled } from "@mui/material/styles";
import {
  Card,
  Stack,
  Link,
  Container,
  Typography,
  InputAdornment,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, resetErrorLoginRegister } from "../../redux/actions/Auth";

// const RootStyle = styled("div")(({ theme }) => ({
//   [theme.breakpoints.up("md")]: {
//     display: "flex",
//   },
// }));
const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 580,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(2, 0),
}));

export default function Register() {
  const { errorRegister, loadingRegister, responseRegister } = useSelector(
    (state) => state.AuthReducer
  );
  let location = useLocation();
  const history = useHistory();
  useEffect(() => {
    if (responseRegister) {
      // đăng ký thành công thì đăng nhập, responseRegister để bỏ qua componentditmount
      setTimeout(() => {
        history.push("/login", location.state);
      }, 1000);
    }
  }, [responseRegister]);

  useEffect(() => {
    return () => {
      dispatch(resetErrorLoginRegister());
    };
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const dispatch = useDispatch();

  const phoneRegExp =
    /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string().required("*Họ tên không được bỏ trống !"),
    email: Yup.string()
      .required("*Email không được bỏ trống !")
      .email("* Email không hợp lệ "),
    password: Yup.string().required("*Mật khẩu không được bỏ trống!"),
    passwordConfirm: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "*Mật khẩu và mật khẩu xác nhận phải khớp!"
    ),
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
      fullName: "",
      email: "",
      phoneNumber: "",
      gender: "",
      password: "",
      passwordConfirm: "",
      dateOfBirth: "",
      remember: true,
    },
    validationSchema: RegisterSchema,
    onSubmit: (user) => {
      dispatch(register(user));
    },
  });
  const { errors, touched, handleSubmit, getFieldProps } = formik;
  const [gender, setGender] = useState(10);

  const handleChange = (event) => {
    setGender(event.target.value);
  };
  return (
    <div className="flex">
      {/* <AuthLayout></AuthLayout> */}
      <SectionStyle>
        <img src="../img/login.png" alt="login" className="w-full h-full" />
      </SectionStyle>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 2 }}>
            <Typography
              variant="h3"
              sx={{ marginBottom: "30px" }}
              gutterBottom
              className="font-bold text-green-600 text-center"
            >
              Đăng ký MovieApp!
            </Typography>
          </Stack>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {errorRegister && (
                  <Fragment>
                    <Alert
                      severity="error"
                      sx={{
                        backgroundColor: "rgb(255, 231, 217)",
                        color: "rgb(122, 12, 46)",
                        "& .MuiAlert-icon": {
                          color: "rgb(255, 72, 66)",
                        },
                      }}
                    >
                      {errorRegister}
                    </Alert>
                  </Fragment>
                )}
                {responseRegister && (
                  <Fragment>
                    <Alert
                      severity="success"
                      sx={{
                        backgroundColor: "rgb(205, 256, 210)",
                        color: "rgb(39, 44, 34)",
                        "& .MuiAlert-icon": {
                          color: "rgb(111, 180, 100)",
                        },
                      }}
                    >
                      Đăng ký thành công!
                    </Alert>
                  </Fragment>
                )}
                <TextField
                  fullWidth
                  autoComplete="fullName"
                  type="text"
                  label="Họ tên"
                  {...getFieldProps("fullName")}
                  error={Boolean(touched.fullName && errors.fullName)}
                  helperText={touched.fullName && errors.fullName}
                />
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
                      labelId="select-gender"
                      id="select-gender"
                      value={gender}
                      label="Giới Tính"
                      onChange={handleChange}
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
                  fullWidth
                  autoComplete="email"
                  type="email"
                  label="Email"
                  {...getFieldProps("email")}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />

                <TextField
                  fullWidth
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  label="Mật khẩu"
                  {...getFieldProps("password")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                />
                <TextField
                  fullWidth
                  autoComplete="current-password"
                  type={showPasswordConfirm ? "text" : "password"}
                  label="Nhập lại mật khẩu"
                  {...getFieldProps("passwordConfirm")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setShowPasswordConfirm((prev) => !prev)
                          }
                        >
                          <Icon
                            icon={showPasswordConfirm ? eyeFill : eyeOffFill}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(
                    touched.passwordConfirm && errors.passwordConfirm
                  )}
                  helperText={touched.passwordConfirm && errors.passwordConfirm}
                />
                <TextField
                  id="date"
                  label="Ngày tháng năm sinh"
                  type="date"
                  sx={{ width: 480 }}
                  {...getFieldProps("dateOfBirth")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={Boolean(touched.dateOfBirth && errors.dateOfBirth)}
                  helperText={touched.dateOfBirth && errors.dateOfBirth}
                />
                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={loadingRegister}
                >
                  Đăng ký
                </LoadingButton>
              </Stack>
            </Form>
          </FormikProvider>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Có tài khoản?&nbsp;
            <Link
              underline="none"
              variant="subtitle2"
              component={RouterLink}
              to="/login"
            >
              Đăng nhập
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </div>
  );
}
