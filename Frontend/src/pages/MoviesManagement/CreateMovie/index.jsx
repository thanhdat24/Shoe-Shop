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

export default function CreateMovie() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { successAddMovie, loadingAddMovie, errorAddMovie } = useSelector(
    (state) => state.MovieReducer
  );
  const { enqueueSnackbar } = useSnackbar();

  const UpdateSchema = Yup.object().shape({
    name: Yup.string().required("*Tên phim không được bỏ trống !"),
    genre: Yup.string().required("*Thể loại phim không được bỏ trống !"),
    trailer: Yup.string().required("*Trailer không được bỏ trống !"),
    description: Yup.string().required("*Nội dung không được bỏ trống !"),

    releaseDate: Yup.date()
      .required("*Thời gian chiếu không được bỏ trống!")
      .test("checkDate", "Ngày chiếu phải lớn hơn ngày hôm nay!", (value) => {
        var today = new Date();
        return value > today;
      }),
    duration: Yup.string().required("*Vui lòng nhập thời lượng phim!"),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      trailer: "",
      description: "",
      duration: "",
      releaseDate: moment("").format("YYYY-MM-DD"),
      photo: "",
      genre: "",
      banner: "",
      remember: true,
      nowShowing: false,
      comingSoon: false,
    },

    validationSchema: UpdateSchema,
    onSubmit: (movie) => {
      if (loadingAddMovie || !isReadyAddMovie) {
        return;
      }
      console.log("movie", movie);
      dispatch(addMovieUploadImg(movie));
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

  const [isReadyAddMovie, setIsReadyAddMovie] = useState(false);
  useEffect(() => {
    if (
      values.name &&
      values.trailer &&
      values.description &&
      values.duration &&
      values.releaseDate &&
      values.photo &&
      values.genre &&
      values.banner
    )
      setIsReadyAddMovie(true);
    else setIsReadyAddMovie(false);
  }, [
    values.name,
    values.trailer,
    values.description,
    values.duration,
    values.releaseDate,
    values.photo,
    values.genre,
    values.banner,
  ]);
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
      href="/admin/movies/list"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Phim
    </Link>,
    <Typography key="3" color="inherit">
      Phim mới
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
    if (successAddMovie) {
      setTimeout(() => {
        history.push("/admin/movies/list");
      }, 100);
      setTimeout(() => {
        enqueueSnackbar("Thêm phim thành công!", { variant: "success" });
      }, 150);
      return;
    }
    if (errorAddMovie) {
      enqueueSnackbar(errorAddMovie, { variant: "error" });
    }
  }, [successAddMovie, errorAddMovie]);

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
            Tạo phim
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
                      Thông tin phim
                    </div>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        autoComplete="name"
                        type="text"
                        label="Tên phim"
                        {...getFieldProps("name")}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                      <TextField
                        fullWidth
                        label="Thể loại"
                        {...getFieldProps("genre")}
                        error={Boolean(touched.genre && errors.genre)}
                        helperText={touched.genre && errors.genre}
                      />
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <TextField
                          id="date"
                          label="Ngày khởi chiếu"
                          type="date"
                          sx={{ width: "100%" }}
                          {...getFieldProps("releaseDate")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={Boolean(
                            touched.releaseDate && errors.releaseDate
                          )}
                          helperText={touched.releaseDate && errors.releaseDate}
                        />
                        <TextField
                          fullWidth
                          label="Thời lượng"
                          {...getFieldProps("duration")}
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
                        error={Boolean(
                          touched.description && errors.description
                        )}
                        helperText={touched.description && errors.description}
                      />
                      <TextField
                        fullWidth
                        autoComplete="description"
                        type="text"
                        label="Trailer"
                        {...getFieldProps("trailer")}
                        error={Boolean(touched.trailer && errors.trailer)}
                        helperText={touched.trailer && errors.trailer}
                      />
                      {/* <FormControl component="fieldset">
                        <FormGroup aria-label="position" row>
                          <FormControlLabel
                            sx={{ marginRight: "2rem" }}
                            control={
                              <Switch
                                checked={values.nowShowing}
                                onChange={handleChangeNowShowing}
                                name="nowShowing"
                                value={values.nowShowing}
                              />
                            }
                            labelPlacement="start"
                            label="Đang chiếu"
                          />

                          <FormControlLabel
                            control={
                              <Switch
                                checked={values.comingSoon}
                                onChange={handleChangeComingSoon}
                                name="comingSoon"
                                value={values.comingSoon}
                              />
                            }
                            labelPlacement="start"
                            label="Sắp chiếu"
                          />
                        </FormGroup>
                      </FormControl> */}
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
                            {srcBanner ? (
                              <Box sx={{ width: "95%", height: "400px" }}>
                                <img
                                  accept="image/*"
                                  multiple
                                  src={srcBanner}
                                  alt="avatar"
                                  className="w-full h-auto inline-flex object-cover rounded-2xl"
                                />
                              </Box>
                            ) : (
                              <Box sx={{ width: "220px" }}>
                                <img
                                  accept="image/*"
                                  multiple
                                  src="/img/export-23.svg"
                                  alt="avatar"
                                  className="inline-flex w-64"
                                />
                              </Box>
                            )}

                            {srcBanner ? (
                              ""
                            ) : (
                              <Box sx={{ padding: "24px" }}>
                                <Typography
                                  variant="h5"
                                  gutterBottom
                                  component="h5"
                                >
                                  Kéo thả hoặc chọn tệp
                                </Typography>
                              </Box>
                            )}
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
                    <div className="mb-4 text-lg font-semibold text-center uppercase text-green-600">
                      Hình ảnh phim
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
                onClickHistory="/admin/movies/list"
                disabledButton={isReadyAddMovie}
                loadingButton={loadingAddMovie}
                title="Tạo mới"
              />
            </Form>
          </Formik>
        </Fragment>
      </Box>
    </Container>
  );
}
