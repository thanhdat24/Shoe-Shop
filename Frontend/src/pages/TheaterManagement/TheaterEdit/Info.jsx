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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import * as Yup from "yup";

import { Icon } from "@iconify/react";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import { useFormik, Form, ErrorMessage, Formik, FormikProvider } from "formik";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import {
  resetCreateTheater,
  updateTheater,
} from "../../../redux/actions/Theater";

export default function Info({ successDetailTheater }) {
  const dispatch = useDispatch();
  const history = useHistory();
  // useEffect(() => {
  //   dispatch(getDetailTheater(successDetailTheater?._id));
  // }, []);
  const {
    loadingDetailTheater,
    loadingUpdateTheater,
    successUpdateTheater,
    errorUpdateTheater,
  } = useSelector((state) => state.TheaterReducer);
  const { enqueueSnackbar } = useSnackbar();
  const UpdateSchema = Yup.object().shape({
    name: Yup.string().required("*Tên rạp không được bỏ trống !"),
    type: Yup.string().required("*Loại rạp không được bỏ trống !"),
  });
  const { theaterClusterList } = useSelector(
    (state) => state.TheaterClusterReducer
  );

  const formik = useFormik({
    initialValues: {
      name: successDetailTheater?.name,
      type: successDetailTheater?.type,
      idTheaterCluster: successDetailTheater?.idTheaterCluster._id,
    },

    validationSchema: UpdateSchema,
    onSubmit: (theater) => {
      if (loadingDetailTheater) {
        return;
      }
      dispatch(updateTheater(theater, successDetailTheater?._id));
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, values } = formik;
  const [type, setType] = useState(10);
  const handleChange = (event) => {
    setType(event.target.value);
  };

  useEffect(() => {
    if (successUpdateTheater) {
      setTimeout(() => {
        history.push("/admin/theater/list");
      }, 100);
      setTimeout(() => {
        enqueueSnackbar("Cập nhật rạp thành công!", { variant: "success" });
      }, 150);
      return;
    }
    if (errorUpdateTheater) {
      enqueueSnackbar(errorUpdateTheater, { variant: "error" });
    }
  }, [successUpdateTheater, errorUpdateTheater]);

  useEffect(() => {
    return () => {
      dispatch(resetCreateTheater());
    };
  }, []);
  return (
    <Fragment>
      <Box sx={{ margin: "20px 0" }}></Box>
      <Formik value={formik}>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Container>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <Fragment>
                <Box sx={{ margin: "20px 0" }}></Box>
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
                            label="Chọn cụm rạp"
                            {...getFieldProps("idTheaterCluster")}
                            disabled
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
                            loading={loadingUpdateTheater}
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
              </Fragment>
            </Box>
          </Container>
        </Form>
      </Formik>
    </Fragment>
  );
}
