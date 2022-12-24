import React, { Fragment, useEffect, useState } from "react";
import {
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
  Typography,
} from "@mui/material";
import * as Yup from "yup";

import { Icon } from "@iconify/react";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import { resetUpdate, updateCurrentUser } from "../../../redux/actions/Auth";
import { useFormik, Form, ErrorMessage, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  addMovieUploadImg,
  getDetailMovie,
  resetMoviesManagement,
  updateMovie,
} from "../../../redux/actions/Movie";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useHistory, useParams } from "react-router-dom";
import OptionClick from "../../../components/Option/OptionClick";

export default function Info({ successDetailMovie }) {
  console.log("successDetailMovie", successDetailMovie);
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    loadingDetailMovie,
    successUpdateMovie,
    errorUpdateMovie,
    loadingUpdateMovie,
  } = useSelector((state) => state.MovieReducer);
  const { enqueueSnackbar } = useSnackbar();
  const UpdateSchema = Yup.object().shape({
    name: Yup.string().required("*Tên phim không được bỏ trống !"),
    trailer: Yup.string().required("*Trailer không được bỏ trống !"),
    description: Yup.string().required("*Nội dung không được bỏ trống !"),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: successDetailMovie?.name,
      trailer: successDetailMovie?.trailer,
      description: successDetailMovie?.description,
      duration: successDetailMovie?.duration,
      genre: successDetailMovie?.genre,
      releaseDate: moment(successDetailMovie?.releaseDate).format("YYYY-MM-DD"),
      remember: true,
    },

    validationSchema: UpdateSchema,
    onSubmit: (movie) => {
      if (loadingDetailMovie) {
        return;
      }
      dispatch(updateMovie(movie, params.idMovie));
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

  const [srcImage, setSrcImage] = useState("");
  const [srcBanner, setSrcBanner] = useState("");
  const handleChangeFile = (e) => {
    let file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      // sau khi thực hiên xong lênh trên thì set giá trị có được
      setSrcImage(e.target.result);
      formik.setFieldValue("photo", file);
    };
    // Đem dữ liệu file lưu vào formik
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
    if (successUpdateMovie) {
      setTimeout(() => {
        history.push("/admin/movies/list");
      }, 100);
      setTimeout(() => {
        enqueueSnackbar("Cập nhật phim thành công!", { variant: "success" });
      }, 150);
      return;
    }
    if (errorUpdateMovie) {
      enqueueSnackbar(errorUpdateMovie, { variant: "error" });
    }
  }, [successUpdateMovie, errorUpdateMovie]);

  useEffect(() => {
    return () => {
      dispatch(resetMoviesManagement());
    };
  }, []);

  const handleChangeNowShowing = (event, checked) => {
    setFieldValue("nowShowing", checked ? true : false);
  };
  const handleChangeComingSoon = (event, checked) => {
    setFieldValue("comingSoon", checked ? true : false);
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
                <div className="mb-5 text-lg font-semibold">Thông tin phim</div>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    autoComplete="name"
                    type="text"
                    label="Tên phim"
                    {...getFieldProps("name")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <TextField
                    fullWidth
                    label="Thể loại"
                    {...getFieldProps("genre")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={Boolean(touched.genre && errors.genre)}
                    helperText={touched.genre && errors.genre}
                  />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      id="date"
                      disabled={successDetailMovie?.nowShowing && true}
                      label="Ngày khởi chiếu"
                      type="date"
                      sx={{ width: "100%" }}
                      {...getFieldProps("releaseDate")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={Boolean(touched.releaseDate && errors.releaseDate)}
                      helperText={touched.releaseDate && errors.releaseDate}
                    />
                    <TextField
                      fullWidth
                      label="Thời lượng"
                      {...getFieldProps("duration")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={Boolean(touched.duration && errors.duration)}
                      helperText={touched.duration && errors.duration}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    id="outlined-multiline-static"
                    label="Nội dung"
                    multiline
                    rows={5}
                    {...getFieldProps("description")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                  <TextField
                    fullWidth
                    autoComplete="description"
                    type="text"
                    label="Trailer"
                    {...getFieldProps("trailer")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={Boolean(touched.trailer && errors.trailer)}
                    helperText={touched.trailer && errors.trailer}
                  />
                </Stack>
              </Card>
              <Card
                sx={{
                  borderRadius: " 16px",
                  zIndex: 0,
                  padding: "24px 0 ",
                  marginTop: "20px",
                }}
              >
                <div className="mb-3 text-lg font-semibold text-center uppercase text-green-600">
                  Banner phim
                </div>
                <hr />
                <div className="text-center">
                  <div
                    className="w-full h-full border-1 border-dashed border-gray-200 inline-flex"
                    style={{
                      backgroundColor: "rgb(244, 246, 248)",
                    }}
                  >
                    <label className="w-full h-full outline-none overflow-hidden items-center justify-center relative cursor-pointer py-12 ">
                      <input
                        type="file"
                        id="poster"
                        name="poster"
                        hidden
                        multiple
                        onChange={handleChangeBanner}
                      />
                      <div className="flex items-center justify-center w-full">
                        <Box sx={{ width: "95%", height: "400px" }}>
                          <img
                            accept="image/*"
                            multiple
                            src={
                              srcBanner === ""
                                ? successDetailMovie?.banner
                                : srcBanner
                            }
                            alt="avatar"
                            className="w-full h-auto inline-flex object-cover rounded-2xl"
                          />
                        </Box>
                      </div>
                    </label>
                  </div>
                </div>
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
                <div className="mb-5 text-lg font-semibold">Hình ảnh phim</div>
                <hr />
                <div className="text-center">
                  <div className="w-full h-full border-2 border-dashed border-gray-200 inline-flex">
                    <label className="w-full h-full outline-none overflow-hidden items-center justify-center relative cursor-pointer py-12">
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
                          srcImage === "" ? successDetailMovie?.photo : srcImage
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
            onClickHistory="/admin/movies/list"
            disabledButton={true}
            loadingButton={loadingUpdateMovie}
            title="Chỉnh sửa"
          />
        </Form>
      </Formik>
    </Fragment>
  );
}
