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
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useFormik, Form, ErrorMessage, Formik } from "formik";
import Grid from "@mui/material/Grid";
import { useSnackbar } from "notistack";
import { filter } from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { styled } from "@mui/material/styles";
import * as Yup from "yup";
import moment from "moment";
import { useHistory } from "react-router-dom";
import Label from "../../../components/Label";
import { resetUserList, updateUser } from "../../../redux/actions/Users";

function changeActive(active) {
  if (active) {
    return "Active";
  } else {
    return "Banned";
  }
}

export default function Info({ successGetDetailUser }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { successUpdateUser, loadingUpdateUser, errorUpdateUser } = useSelector(
    (state) => state.UserManagement
  );
  const { enqueueSnackbar } = useSnackbar();
  const [valueRole, setValueRole] = useState(successGetDetailUser?.role);
  const [srcImage, setSrcImage] = useState(successGetDetailUser?.photo);
  console.log("successGetDetailUser", successGetDetailUser);
  console.log("srcImage", srcImage);

  const handleChangeRole = (event) => {
    setValueRole(event.target.value);
  };
  const [gender, setGender] = useState(successGetDetailUser?.gender);
  console.log("gender", gender);

  const handleChangeGender = (event) => {
    setGender(event.target.value);
  };
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
    enableReinitialize: true,
    initialValues: {
      fullName: successGetDetailUser?.fullName,
      email: successGetDetailUser?.email,
      phoneNumber: successGetDetailUser?.phoneNumber,
      gender: gender ? gender : successGetDetailUser?.gender,
      dateOfBirth: moment(successGetDetailUser?.dateOfBirth).format(
        "YYYY-MM-DD"
      ),
      role: valueRole ? valueRole : successGetDetailUser?.role,
      active: successGetDetailUser?.active,
      photo: srcImage ? srcImage : successGetDetailUser?.photo,
      remember: true,
    },

    validationSchema: UpdateSchema,
    onSubmit: (user) => {
      console.log("user", user);
      if (loadingUpdateUser) {
        return;
      }
      dispatch(updateUser(user, successGetDetailUser?._id));
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    values,
  } = formik;

  const handleChangeActive = (event, checked) => {
    setFieldValue("active", checked ? true : false);
  };
  useEffect(() => {
    if (successUpdateUser) {
      setTimeout(() => {
        history.push("/admin/users/list");
      }, 100);
      setTimeout(() => {
        enqueueSnackbar("Cập nhật thành công!", { variant: "success" });
      }, 150);
      return;
    }
    if (errorUpdateUser) {
      enqueueSnackbar(errorUpdateUser, { variant: "error" });
    }
  }, [successUpdateUser, errorUpdateUser]);

  useEffect(() => {
    return () => {
      dispatch(resetUserList());
    };
  }, []);

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
        <Form onSubmit={handleSubmit}>
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
                <Label
                  variant="ghost"
                  color={(!values.active && "error") || "success"}
                  sx={{
                    height: "22px",
                    minWidth: "22px",
                    lineHeight: 0,
                    borderRadius: "6px",
                    cursor: "default",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    justifyContent: "center",
                    padding: "0px 8px",
                    fontSize: "0.75rem",
                    fontFamily: "sans-serif",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    position: "absolute",
                    top: " 24px",
                    right: "24px",
                  }}
                >
                  {changeActive(values.active)}
                </Label>
                <div className="mb-8">
                  <div className="w-36 h-36 rounded-full p-2 border-2 border-dashed border-gray-300 inline-flex">
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
                            src={
                              srcImage ? srcImage : successGetDetailUser?.photo
                            }
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <FormControlLabel
                  sx={{
                    display: " inline-flex",
                    justifyContent: "space-between",
                    width: " 100%",
                    marginLeft: "0px",
                    marginRight: " 0px",
                  }}
                  control={
                    <Switch
                      name="active"
                      checked={values.active}
                      value={values.active}
                      onChange={handleChangeActive}
                    />
                  }
                  label="Trạng thái hoạt động"
                  labelPlacement="start"
                />
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
                      InputLabelProps={{
                        shrink: true,
                      }}
                      autoComplete="fullName"
                      type="text"
                      label="Họ tên"
                      {...getFieldProps("fullName")}
                      error={Boolean(touched.fullName && errors.fullName)}
                      helperText={touched.fullName && errors.fullName}
                    />{" "}
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled
                      autoComplete="email"
                      type="email"
                      label="Email"
                      {...getFieldProps("email")}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label="Số điện thoại"
                      {...getFieldProps("phoneNumber")}
                      error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                    />
                    <FormControl
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                        value={
                          gender ? gender : `${successGetDetailUser?.gender}`
                        }
                        label="Giới Tính"
                        onChange={handleChangeGender}
                        // {...getFieldProps("gender")}
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
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      sx={{ width: "49%" }}
                      id="date"
                      label="Ngày tháng năm sinh"
                      type="date"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      {...getFieldProps("dateOfBirth")}
                      error={Boolean(touched.dateOfBirth && errors.dateOfBirth)}
                      helperText={touched.dateOfBirth && errors.dateOfBirth}
                    />
                    <FormControl sx={{ marginLeft: "30px !important" }}>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        Vai trò
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={
                          valueRole
                            ? valueRole
                            : `${successGetDetailUser?.role}`
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={handleChangeRole}
                        // {...getFieldProps("role")}
                      >
                        <FormControlLabel
                          value={`admin`}
                          control={<Radio />}
                          label="Admin"
                        />
                        <FormControlLabel
                          value={`user`}
                          control={<Radio />}
                          label="User"
                        />
                      </RadioGroup>
                    </FormControl>
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
                      loading={loadingUpdateUser}
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
