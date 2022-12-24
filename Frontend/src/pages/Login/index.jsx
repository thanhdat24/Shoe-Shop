import React, { Fragment, useEffect } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import * as Yup from "yup";
import { Link as RouterLink, useHistory, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";
import { styled } from "@mui/material/styles";
import {
  Card,
  Stack,
  Link,
  Container,
  Typography,
  Checkbox,
  InputAdornment,
  TextField,
  IconButton,
  FormControlLabel,
  Alert,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions/Auth";
import AuthSocial from "./AuthSocial";
import { LOADING_BACKTO_HOME } from "../../redux/constants/Lazy";

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
  padding: theme.spacing(12, 0),
}));

export default function Login() {
  const { errorLogin, currentUser, loadingLogin } = useSelector(
    (state) => state.AuthReducer
  );
  const history = useHistory();
  let location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    // đăng nhập thành công thì quay về trang trước đó
    console.log("currentUser", currentUser);
    console.log("location.state", location.state);
    if (currentUser) {
      if (location.state === "/") {
        // nếu trang trước đó là "/" thì phải hiện loading do trang home mất nhiều thời gian tải
        dispatch({ type: LOADING_BACKTO_HOME });
        setTimeout(() => {
          history.push("/");
        }, 50);
        return undefined;
      } else if (
        location.pathname === "/login" &&
        location.state === undefined
      ) {
        history.push("/");
      }
      history.push(location.state);
    }
  }, [currentUser]);
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email phải là một địa chỉ email hợp lệ!")
      .required("*Vui lòng nhập email!"),
    password: Yup.string().required("*Vui lòng nhập mật khẩu!"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: (user) => {
      dispatch(login(user));
    },
  });
  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <div className="flex">
      {/* <AuthLayout></AuthLayout> */}
      <SectionStyle>
        <img src="../img/login.png" alt="login" className="w-full h-full" />
      </SectionStyle>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 3 }}>
            <Typography
              variant="h3"
              sx={{ marginBottom: "30px" }}
              gutterBottom
              className="font-bold text-green-600 text-center"
            >
              Đăng nhập MovieApp!
            </Typography>
          </Stack>

          <AuthSocial />

          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {errorLogin && (
                  <Fragment>
                    <Alert
                      severity="error"
                      color="error"
                      sx={{
                        backgroundColor: "rgb(255, 231, 217)",
                        color: "rgb(122, 12, 46)",
                        "& .MuiAlert-icon": {
                          color: "rgb(255, 72, 66)",
                        },
                      }}
                    >
                      {errorLogin}
                    </Alert>
                  </Fragment>
                )}
                {currentUser && (
                  <Fragment>
                    <Alert
                      sx={{
                        backgroundColor: "rgb(205, 256, 210)",
                        color: "rgb(39, 44, 34)",
                        "& .MuiAlert-icon": {
                          color: "rgb(111, 180, 100)",
                        },
                      }}
                      severity="success"
                    >
                      Đăng nhập thành công!
                    </Alert>
                  </Fragment>
                )}
                <TextField
                  fullWidth
                  autoComplete="username"
                  type="email"
                  label="Địa chỉ email"
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
                        <IconButton onClick={handleShowPassword} edge="end">
                          <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Stack>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ my: 2 }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      {...getFieldProps("remember")}
                      checked={values.remember}
                    />
                  }
                  label="Ghi nhớ tôi"
                />

                <Link
                  to="/reset-password"
                  component={RouterLink}
                  variant="subtitle2"
                >
                  Quên mật khẩu?
                </Link>
              </Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={loadingLogin}
              >
                Đăng nhập
              </LoadingButton>
            </Form>
          </FormikProvider>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Không có tài khoản?&nbsp;
            <Link
              underline="none"
              variant="subtitle2"
              component={RouterLink}
              to="/register"
            >
              Đăng ký ngay
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </div>
  );
}
