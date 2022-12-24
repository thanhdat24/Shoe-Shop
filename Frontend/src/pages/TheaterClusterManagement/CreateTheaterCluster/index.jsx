import React, { Fragment, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Stack,
  Grid,
  Card,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormGroup,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import * as Yup from "yup";

import { Icon } from "@iconify/react";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import { useFormik, Form, ErrorMessage, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import {
  addMovieUploadImg,
  resetMoviesManagement,
} from "../../../redux/actions/Movie";
import OptionClick from "../../../components/Option/OptionClick";
import { createTheaterCluster } from "../../../redux/actions/TheaterCluster";
import { getTheaterSystemList } from "../../../redux/actions/TheaterSystem";

export default function CreateTheaterCluster() {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    successCreateTheaterCluster,
    loadingCreateTheaterCluster,
    errorCreateTheaterCluster,
  } = useSelector((state) => state.TheaterClusterReducer);
  const { enqueueSnackbar } = useSnackbar();

  const { theaterSystemList } = useSelector(
    (state) => state.TheaterSystemReducer
  );
  console.log("theaterSystemList", theaterSystemList);
  useEffect(() => {
    dispatch(getTheaterSystemList());
  }, []);

  const UpdateSchema = Yup.object().shape({
    name: Yup.string().required("*Tên cụm rạp không được bỏ trống !"),
    address: Yup.string().required("*Địa chỉ không được bỏ trống !"),
    idTheaterSystem: Yup.string().required(
      "*Hệ thống rạp không được bỏ trống !"
    ),
    photo: Yup.string().required("*Hình ảnh không được bỏ trống !"),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      idTheaterSystem: "",
      photo: "",
    },

    validationSchema: UpdateSchema,
    onSubmit: (theaterCluster) => {
      if (loadingCreateTheaterCluster || !isReadyCreateTheaterCluster) {
        return;
      }
      console.log("theaterCluster", theaterCluster);
      dispatch(createTheaterCluster(theaterCluster));
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    getFieldProps,
    values,
    setFieldValue,
  } = formik;

  const [isReadyCreateTheaterCluster, setIsReadyCreateTheaterCluster] =
    useState(false);
  useEffect(() => {
    if (values.name && values.address && values.idTheaterSystem && values.photo)
      setIsReadyCreateTheaterCluster(true);
    else setIsReadyCreateTheaterCluster(false);
  }, [values.name, values.address, values.idTheaterSystem, values.photo]);
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
      href="/admin/theater-cluster/list"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Cụm rạp
    </Link>,
    <Typography key="3" color="inherit">
      Cụm rạp mới
    </Typography>,
  ];
  const [srcImage, setSrcImage] = useState(null);
  const [srcBanner, setSrcBanner] = useState(null);
  const handleChangeFile = (e) => {
    let file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      // sau khi thực hiên xong lênh trên thì set giá trị có được
      // Đem dữ liệu file lưu vào formik
      setSrcImage(e.target.result);
      formik.setFieldValue("photo", e.target.result);
    };
  };

  const handleChangeBanner = (e) => {
    let file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      // sau khi thực hiên xong lênh trên thì set giá trị có được
      // Đem dữ liệu file lưu vào formik
      setSrcBanner(e.target.result);
      formik.setFieldValue("banner", e.target.result);
    };
  };

  useEffect(() => {
    if (successCreateTheaterCluster) {
      setTimeout(() => {
        history.push("/admin/theater-cluster/list");
      }, 100);
      setTimeout(() => {
        enqueueSnackbar("Thêm cụm rạp thành công!", { variant: "success" });
      }, 150);
      return;
    }
    if (errorCreateTheaterCluster) {
      enqueueSnackbar(errorCreateTheaterCluster, { variant: "error" });
    }
  }, [successCreateTheaterCluster, errorCreateTheaterCluster]);

  useEffect(() => {
    return () => {
      dispatch(resetMoviesManagement());
    };
  }, []);
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
            Tạo cụm rạp
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Fragment>
          <Box sx={{ margin: "20px 0" }}></Box>
          <Formik value={formik}>
            <Form onSubmit={handleSubmit} enctype="multipart/form-data">
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                mb={9}
              >
                <Grid item xs={8}>
                  <Card
                    sx={{
                      borderRadius: " 16px",
                      zIndex: 0,
                      padding: "24px",
                    }}
                  >
                    <div className="mb-4 text-lg font-semibold text-center uppercase text-green-600">
                      Thông tin cụm rạp
                    </div>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        autoComplete="name"
                        type="text"
                        label="Tên cụm rạp"
                        {...getFieldProps("name")}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                      <FormControl
                        fullWidth
                        error={Boolean(
                          touched.idTheaterCluster && errors.idTheaterCluster
                        )}
                        helperText={
                          touched.idTheaterCluster && errors.idTheaterCluster
                        }
                      >
                        <InputLabel id="theater-cluster">
                          Chọn hệ thống rạp
                        </InputLabel>
                        <Select
                          fullWidth
                          autoComplete="name"
                          type="text"
                          label="Chọn hệ thống rạp"
                          {...getFieldProps("idTheaterSystem")}
                          error={Boolean(
                            touched.idTheaterSystem && errors.idTheaterSystem
                          )}
                          helperText={
                            touched.idTheaterSystem && errors.idTheaterSystem
                          }
                        >
                          {theaterSystemList?.data?.map((item) => (
                            <MenuItem key={item._id} value={item._id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        id="outlined-multiline-static"
                        label="Địa chỉ"
                        multiline
                        rows={5}
                        {...getFieldProps("address")}
                        error={Boolean(touched.address && errors.address)}
                        helperText={touched.address && errors.address}
                      />
                    </Stack>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card
                    sx={{
                      borderRadius: " 16px",
                      zIndex: 0,
                      padding: " 26px 24px",
                    }}
                  >
                    <div className="mb-4 text-lg font-semibold text-center uppercase text-green-600">
                      Hình ảnh cụm rạp
                    </div>
                    <hr />
                    <div className="text-center">
                      <div className="w-full h-full border-2 border-dashed border-gray-200 inline-flex">
                        <label className="w-full h-full outline-none overflow-hidden items-center justify-center relative cursor-pointer py-12 ">
                          <input
                            type="file"
                            id="poster"
                            name="poster"
                            hidden
                            multiple
                            onChange={handleChangeFile}
                          />
                          {srcImage ? (
                            <img
                              accept="image/*"
                              multiple
                              src={srcImage}
                              alt="avatar"
                              className="w-48 h-auto inline-flex object-cover rounded-2xl"
                            />
                          ) : (
                            <img
                              accept="image/*"
                              multiple
                              src="/img/export-23.svg"
                              alt="avatar"
                              className="inline-flex w-64"
                            />
                          )}
                          {srcImage ? (
                            ""
                          ) : (
                            <h5 className="mt-3">
                              Nhấn hoặc kéo thả hình ảnh vào đây để tải lên
                            </h5>
                          )}
                          {srcImage ? "" : <p className="mb-2">or</p>}
                          {srcImage ? (
                            ""
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              component="span"
                            >
                              Upload
                            </Button>
                          )}
                        </label>
                      </div>
                    </div>
                    {/* <span className="overflow-hidden z-50 w-full h-full block">
                      <span className=" w-36 h-36 bg-cover inline-block">
                        <img
                          src={srcImage}
                          alt="avatar"
                          className="w-full h-full object-cover"
                        />
                      </span>
                    </span> */}
                  </Card>
                </Grid>
              </Grid>
              <OptionClick
                onClickHistory="/admin/theater-cluster/list"
                disabledButton={isReadyCreateTheaterCluster}
                loadingButton={loadingCreateTheaterCluster}
                title="Tạo mới"
              />
            </Form>
          </Formik>
        </Fragment>
      </Box>
    </Container>
  );
}
