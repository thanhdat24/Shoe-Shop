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
import { useHistory, useParams } from "react-router-dom";
import OptionClick from "../../../components/Option/OptionClick";

import { updateTheaterCluster } from "../../../redux/actions/TheaterCluster";
export default function Info({ successDetailTheaterCluster }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    successUpdateTheaterCluster,
    errorUpdateTheaterCluster,
    loadingUpdateTheaterCluster,
  } = useSelector((state) => state.TheaterClusterReducer);
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();

  const { theaterSystemList } = useSelector(
    (state) => state.TheaterSystemReducer
  );
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
      name: successDetailTheaterCluster?.name,
      address: successDetailTheaterCluster?.address,
      idTheaterSystem: successDetailTheaterCluster?.idTheaterSystem?._id,
      photo: "",
    },

    validationSchema: UpdateSchema,
    onSubmit: (theaterCluster) => {
      if (loadingUpdateTheaterCluster) {
        return;
      }
      console.log("theaterCluster", theaterCluster);
      dispatch(updateTheaterCluster(theaterCluster, params.theaterClusterId));
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const [srcImage, setSrcImage] = useState("");
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

  useEffect(() => {
    if (successUpdateTheaterCluster) {
      setTimeout(() => {
        history.push("/admin/theater-cluster/list");
      }, 100);
      setTimeout(() => {
        enqueueSnackbar("Cập nhật rạp thành công!", { variant: "success" });
      }, 150);
      return;
    }
    if (errorUpdateTheaterCluster) {
      enqueueSnackbar(errorUpdateTheaterCluster, { variant: "error" });
    }
  }, [successUpdateTheaterCluster, errorUpdateTheaterCluster]);

  // useEffect(() => {
  //   return () => {
  //     dispatch(resetMoviesManagement());
  //   };
  // }, []);
  return (
    <Container
      sx={{ paddingRight: "0px !important", paddingLeft: "0px !important" }}
    >
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

                          <img
                            accept="image/*"
                            multiple
                            src={
                              srcImage === ""
                                ? successDetailTheaterCluster?.photo
                                : srcImage
                            }
                            alt="avatar"
                            className="w-48 h-auto inline-flex object-cover rounded-2xl"
                          />
                        </label>
                      </div>
                    </div>
                  </Card>
                </Grid>
              </Grid>
              <OptionClick
                onClickHistory="/admin/theater-cluster/list"
                disabledButton={true}
                loadingButton={loadingUpdateTheaterCluster}
                title="Tạo mới"
              />
            </Form>
          </Formik>
        </Fragment>
      </Box>
    </Container>
  );
}
