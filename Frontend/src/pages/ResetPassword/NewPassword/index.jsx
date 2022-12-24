import {
  Box,
  Container,
  FormHelperText,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import eyeFill from "@iconify/icons-eva/eye-fill";
import eyeOffFill from "@iconify/icons-eva/eye-off-fill";

import { styled } from "@mui/material/styles";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";

import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, resetAuth } from "../../../redux/actions/Auth";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 535,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  padding: theme.spacing(12, 0),
}));

export default function NewPassword() {
  const {
    responseResetPassword: { email },
    responseForgotPassword,
    loadingForgotPassword,
    errorForgotPassword,
  } = useSelector((state) => state.AuthReducer);
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const ResetSchema = Yup.object().shape({
    email: Yup.string()
      .email("*Email phải là một địa chỉ email hợp lệ")
      .required("*Email là bắt buộc"),
    code1: Yup.string().required("Code is required"),
    code2: Yup.string().required("Code is required"),
    code3: Yup.string().required("Code is required"),
    code4: Yup.string().required("Code is required"),
    code5: Yup.string().required("Code is required"),
    code6: Yup.string().required("Code is required"),
    password: Yup.string().required("*Mật khẩu là bắt buộc!"),
    passwordConfirm: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "*Mật khẩu và mật khẩu xác nhận phải khớp!"
      )
      .required("*Mật khẩu nhập lại là bắt buộc!"),
  });

  const formik = useFormik({
    initialValues: {
      email,
      code1: "",
      code2: "",
      code3: "",
      code4: "",
      code5: "",
      code6: "",
      otp: "",
      password: "",
      passwordConfirm: "",

      remember: true,
    },
    validationSchema: ResetSchema,
    onSubmit: (data) => {
      console.log("data", data);
      dispatch(forgotPassword(data));
    },
  });

  const { values, errors, touched, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleShowPasswordConfirm = () => {
    setShowPasswordConfirm((show) => !show);
  };
  useEffect(() => {
    const totalOtpCode =
      values.code1 +
      values.code2 +
      values.code3 +
      values.code4 +
      values.code5 +
      values.code6;
    console.log("totalOtpCode", totalOtpCode);
    values.otp = totalOtpCode;
  });
  useEffect(() => {
    if (responseForgotPassword) {
      setTimeout(() => {
        history.push("/login");
      }, 250);
      setTimeout(() => {
        enqueueSnackbar("Thay đổi mật khẩu thành công!", {
          variant: "success",
        });
      }, 50);
      return () => dispatch(resetAuth());
    }
    if (errorForgotPassword) {
      enqueueSnackbar(errorForgotPassword, { variant: "error" });
    }
  }, [responseForgotPassword, errorForgotPassword]);

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 2 }}>
            <Typography
              variant="h3"
              sx={{ marginBottom: "30px" }}
              gutterBottom
              className="font-bold text-green-600 text-center"
            >
              Yêu cầu đã được gửi thành công!?
            </Typography>
            <p
              className="font-normal text-base leading-6 mb-10 "
              style={{ color: " #637381" }}
            >
              Chúng tôi đã gửi một email xác nhận gồm 6 chữ số đến email của
              bạn. Vui lòng nhập mã vào ô bên dưới để xác minh email của bạn.
            </p>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    autoComplete="username"
                    type="email"
                    label="Địa chỉ email"
                    {...getFieldProps("email")}
                    disabled
                  />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: " row",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      autoFocus
                      fullWidth
                      type="text"
                      placeholder="-"
                      {...getFieldProps("code1")}
                      error={Boolean(touched.code1 && errors.code1)}
                      inputProps={{ maxLength: 1 }}
                      sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                        width: 56,
                      }}
                    />
                    <TextField
                      fullWidth
                      type="text"
                      placeholder="-"
                      {...getFieldProps("code2")}
                      error={Boolean(touched.code2 && errors.code2)}
                      inputProps={{ maxLength: 1 }}
                      sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                        width: 56,
                        margin: "0px 0px 0px 16px !important",
                      }}
                    />
                    <TextField
                      fullWidth
                      type="text"
                      placeholder="-"
                      {...getFieldProps("code3")}
                      error={Boolean(touched.code3 && errors.code3)}
                      inputProps={{ maxLength: 1 }}
                      sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                        width: 56,
                        margin: "0px 0px 0px 16px !important",
                      }}
                    />
                    <TextField
                      fullWidth
                      type="text"
                      placeholder="-"
                      {...getFieldProps("code4")}
                      error={Boolean(touched.code4 && errors.code4)}
                      inputProps={{ maxLength: 1 }}
                      sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                        width: 56,
                        margin: "0px 0px 0px 16px !important",
                      }}
                    />
                    <TextField
                      fullWidth
                      type="text"
                      placeholder="-"
                      {...getFieldProps("code5")}
                      error={Boolean(touched.code5 && errors.code5)}
                      inputProps={{ maxLength: 1 }}
                      sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                        width: 56,
                        margin: "0px 0px 0px 16px !important",
                      }}
                    />
                    <TextField
                      fullWidth
                      type="text"
                      placeholder="-"
                      {...getFieldProps("code6")}
                      error={Boolean(touched.code6 && errors.code6)}
                      inputProps={{ maxLength: 1 }}
                      sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                        width: 56,
                        margin: "0px 0px 0px 16px !important",
                      }}
                    />
                  </Box>
                  <FormHelperText error sx={{ marginLeft: "13px !important" }}>
                    {(touched.code1 && errors.code1) ||
                      (touched.code2 && errors.code2) ||
                      (touched.code3 && errors.code3) ||
                      (touched.code4 && errors.code4) ||
                      (touched.code5 && errors.code5) ||
                      (touched.code6 && errors.code6)}
                  </FormHelperText>
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
                  <TextField
                    fullWidth
                    type={showPasswordConfirm ? "text" : "password"}
                    label="Nhập lại mật khẩu mới"
                    {...getFieldProps("passwordConfirm")}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleShowPasswordConfirm}
                            edge="end"
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
                    helperText={
                      touched.passwordConfirm && errors.passwordConfirm
                    }
                  />{" "}
                </Stack>

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  className="mt-4"
                  loading={loadingForgotPassword}
                >
                  Đổi mật khẩu
                </LoadingButton>
              </Form>
            </FormikProvider>
          </Stack>
        </ContentStyle>
      </Container>
    </React.Fragment>
  );
}
