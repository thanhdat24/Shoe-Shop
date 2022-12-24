import React, { Fragment, useEffect, useState } from "react";
import { Box, Stack, Card, TextField } from "@mui/material";
import { useFormik, Form, Formik } from "formik";

import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import { changePassword, resetPassword, resetUserList } from "../../../redux/actions/Users";
import { useHistory } from "react-router-dom";
import { LOGOUT } from "../../../redux/constants/Auth";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const { successChangePassword, loadingChangePassword, errorChangePassword } =
    useSelector((state) => state.UserManagement);
  const [isReadyResetPassword, setIsReadyResetPassword] = useState(false);
  const history = useHistory();

  const ChangePasswordSchema = Yup.object().shape({
    passwordCurrent: Yup.string().required("*Vui lòng nhập mật khẩu!"),
    password: Yup.string().required("*Vui lòng nhập mật khẩu mới!"),
    passwordConfirm: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "*Mật khẩu và mật khẩu xác nhận phải khớp!"
    ),
  });

  const { enqueueSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues: {
      passwordCurrent: "",
      password: "",
      passwordConfirm: "",
      remember: true,
    },
    validationSchema: ChangePasswordSchema,

    onSubmit: (user, { resetForm }) => {
      if (loadingChangePassword || !isReadyResetPassword) {
        return;
      }
      dispatch(changePassword(user));

      // reset
      resetForm();
    },
  });
  useEffect(() => {
    return () => {
      dispatch(resetPassword());
    };
  }, []);
  const { errors, touched, handleSubmit, getFieldProps, values } = formik;

  useEffect(() => {
    if (values.passwordCurrent && values.password && values.passwordConfirm)
      setIsReadyResetPassword(true);
    else setIsReadyResetPassword(false);
  }, [values.passwordCurrent, values.password, values.passwordConfirm]);

  useEffect(() => {
    if (successChangePassword) {
      enqueueSnackbar("Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại!", {
        variant: "success",
      });
      setTimeout(() => {
        dispatch({ type: LOGOUT });
      }, 1500);
    }

    if (errorChangePassword) {
      enqueueSnackbar(errorChangePassword, { variant: "error" });
    }
  }, [successChangePassword, errorChangePassword]);
  return (
    <Fragment>
      <Box sx={{ margin: "8px 0" }}></Box>
      <Box sx={{ width: "90%", margin: "auto" }}>
        <Card
          sx={{
            borderRadius: " 16px",
            zIndex: 0,
            padding: " 30px 24px",
            textAlign: "center",
          }}
        >
          <Formik value={formik}>
            <Form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Mật khẩu cũ"
                    {...getFieldProps("passwordCurrent")}
                    error={Boolean(
                      touched.passwordCurrent && errors.passwordCurrent
                    )}
                    helperText={
                      touched.passwordCurrent && errors.passwordCurrent
                    }
                  />{" "}
                  <TextField
                    fullWidth
                    type="password"
                    label="Mật khẩu mới"
                    {...getFieldProps("password")}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                  />{" "}
                  <TextField
                    fullWidth
                    type="password"
                    label="Nhập lại mật khẩu mới"
                    {...getFieldProps("passwordConfirm")}
                    error={Boolean(
                      touched.passwordConfirm && errors.passwordConfirm
                    )}
                    helperText={
                      touched.passwordConfirm && errors.passwordConfirm
                    }
                  />{" "}
                </Stack>
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
                    loading={loadingChangePassword}
                    disabled={!isReadyResetPassword}
                    sx={{
                      padding: "6px 9px",
                      fontWeight: "700",
                      lineHeight: "1.71429",
                      fontSize: "0.8rem",
                      textTransform: "capitalize",
                    }}
                  >
                    Đổi mật khẩu
                  </LoadingButton>
                </Box>
              </Stack>
            </Form>
          </Formik>
        </Card>
      </Box>
    </Fragment>
  );
}
