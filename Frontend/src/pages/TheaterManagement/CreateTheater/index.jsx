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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import * as Yup from "yup";

import { Icon } from "@iconify/react";
import { LoadingButton } from "@mui/lab";
import { useFormik, Form, ErrorMessage, FormikProvider } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import {
  createTheater,
  resetCreateTheater,
} from "../../../redux/actions/Theater";
import { getTheaterClusterList } from "../../../redux/actions/TheaterCluster";

export default function CreateTheater() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { loadingCreateTheater, successCreateTheater, errorCreateTheater } =
    useSelector((state) => state.TheaterReducer);

  const { theaterClusterList } = useSelector(
    (state) => state.TheaterClusterReducer
  );

  useEffect(() => {
    dispatch(getTheaterClusterList());
  }, []);
  const { enqueueSnackbar } = useSnackbar();
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("*Tên rạp không được bỏ trống !"),
    type: Yup.string().required("*Loại rạp không được bỏ trống !"),
    idTheaterCluster: Yup.string().required("*Cụm rạp không được bỏ trống !"),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      idTheaterCluster: "",
    },

    validationSchema: validationSchema,
    onSubmit: (theater) => {
      if (loadingCreateTheater || !setIsReadyCreateTheater) {
        return;
      }
      console.log("theater",  theater);
      dispatch(createTheater(theater));
    },
  });
  const [theaterCluster, setTheaterCluster] = React.useState("");

  const handleTheaterCluster = (event) => {
    setTheaterCluster(event.target.value);
  };

  const { errors, touched, handleSubmit, getFieldProps, values } = formik;
  const [isReadyCreateTheater, setIsReadyCreateTheater] = useState(false);
  useEffect(() => {
    if (values.name && values.type && values.idTheaterCluster)
      setIsReadyCreateTheater(true);
    else setIsReadyCreateTheater(false);
  }, [values.name, values.type, values.idTheaterCluster]);
  const [type, setType] = useState(10);

  const handleChange = (event) => {
    setType(event.target.value);
  };
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
      href="/admin/theater/list"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Rạp
    </Link>,
    <Typography key="3" color="inherit">
      Rạp mới
    </Typography>,
  ];
  useEffect(() => {
    if (successCreateTheater) {
      setTimeout(() => {
        history.push("/admin/theater/list");
      }, 100);
      setTimeout(() => {
        enqueueSnackbar("Thêm rạp thành công!", { variant: "success" });
      }, 150);
      return;
    }
    if (errorCreateTheater) {
      enqueueSnackbar(errorCreateTheater, { variant: "error" });
    }
  }, [successCreateTheater, errorCreateTheater]);

  useEffect(() => {
    return () => {
      dispatch(resetCreateTheater());
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
            Tạo rạp
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Fragment>
          <Box sx={{ margin: "20px 0" }}></Box>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid
                container
                sx={{ padding: "0px 130px" }}
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={12}>
                  <Card
                    sx={{
                      borderRadius: " 16px",
                      zIndex: 0,
                      padding: "24px",
                    }}
                  >
                    <div className="mb-5 text-lg font-semibold">
                      Thông tin rạp
                    </div>
                    <Stack spacing={3}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <TextField
                          fullWidth
                          label="Tên rạp"
                          {...getFieldProps("name")}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                        <FormControl
                          fullWidth
                          error={Boolean(touched.type && errors.type)}
                          helperText={touched.type && errors.type}
                        >
                          <InputLabel id="select-type">Loại rạp</InputLabel>
                          <Select
                            labelId="select-type"
                            id="select-type"
                            value={type}
                            label="Loại rạp"
                            onChange={handleChange}
                            {...getFieldProps("type")}
                          >
                            <MenuItem value={`2D`}>2D</MenuItem>
                            <MenuItem value={`3D`}>3D</MenuItem>
                          </Select>
                          <ErrorMessage
                            name="type"
                            render={(msg) => (
                              <span className="text-red-600 text-xs mt-1 ml-3">
                                {msg}
                              </span>
                            )}
                          />
                        </FormControl>
                      </Stack>
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
                          Chọn cụm rạp
                        </InputLabel>
                        <Select
                          labelId="theater-cluster"
                          id="theater-cluster"
                          value={theaterCluster}
                          label="Chọn cụm rạp"
                          onChange={handleTheaterCluster}
                          {...getFieldProps("idTheaterCluster")}
                        >
                          {theaterClusterList?.data?.map((item) => (
                            <MenuItem key={item._id} value={item._id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

              
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
                          loading={loadingCreateTheater}
                          disabled={!isReadyCreateTheater}
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
          </FormikProvider>
        </Fragment>
      </Box>
    </Container>
  );
}
