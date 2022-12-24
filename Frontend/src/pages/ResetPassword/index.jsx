import {
  Alert,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { useHistory, useLocation } from "react-router-dom";
import { sendOtp, resetAuth } from "../../redux/actions/Auth";

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  padding: theme.spacing(12, 0),
}));
export default function ResetPassword() {
  const {
    loadingResetPassword,
    responseResetPassword,
    errorResetPassword,
  } = useSelector((state) => state.AuthReducer);
  console.log("responseResetPassword", responseResetPassword);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    return () => {
      dispatch(resetAuth());
    };
  }, []);

  useEffect(() => {
    if (responseResetPassword) history.push("/new-password");
  }, [responseResetPassword]);

  const ResetSchema = Yup.object().shape({
    email: Yup.string()
      .email("*Email phải là một địa chỉ email hợp lệ")
      .required("*Email là bắt buộc"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ResetSchema,
    onSubmit: (email) => {
      dispatch(sendOtp(email));
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;
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
              Quên mật khẩu?
            </Typography>
            <p
              className="font-normal text-base leading-6 mb-10 "
              style={{ color: " #637381" }}
            >
              Vui lòng nhập địa chỉ email được liên kết với tài khoản của bạn và
              Chúng tôi sẽ gửi cho bạn một mật khẩu mới qua email của bạn.
            </p>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                {errorResetPassword && (
                  <React.Fragment>
                    <Alert
                      severity="error"
                      color="error"
                      sx={{
                        backgroundColor: "rgb(255, 231, 217)",
                        color: "rgb(122, 12, 46)",
                        "& .MuiAlert-icon": {
                          color: "rgb(255, 72, 66)",
                        },
                        textAlign: "start",
                        marginBottom: "20px",
                      }}
                    >
                      {errorResetPassword}
                    </Alert>
                  </React.Fragment>
                )}
                {responseResetPassword && (
                  <React.Fragment>
                    <Alert
                      className="text-start mt-3"
                      sx={{
                        backgroundColor: "rgb(205, 256, 210)",
                        color: "rgb(39, 44, 34)",
                        "& .MuiAlert-icon": {
                          color: "rgb(111, 180, 100)",
                        },
                        textAlign: "start",
                        marginBottom: "20px",
                      }}
                      severity="success"
                    >
                      {responseResetPassword.message}
                    </Alert>
                  </React.Fragment>
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

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  className="mt-4"
                  loading={loadingResetPassword}
                >
                  Gửi Yêu Cầu
                </LoadingButton>
              </Form>
            </FormikProvider>
            <Button
              className="mt-2"
              size="large"
              variant="text"
              onClick={() => {
                history.push("/login");
              }}
            >
              Back
            </Button>
          </Stack>
        </ContentStyle>
      </Container>
    </React.Fragment>
  );
}
