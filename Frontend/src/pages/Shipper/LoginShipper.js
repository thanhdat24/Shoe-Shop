import { Alert, Box, Button, Icon, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';

import * as yup from 'yup';
import { useNavigate } from 'react-router';
// import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Iconify from '../../components/Iconify';
import { login } from '../../redux/slices/shipperManage';

// import { login } from '../../redux/action/shipperAction';

export default function LoginShipper() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const history = useHistory();
  const { accessToken } = useSelector((state) => state.shipperManage);
  const [showPassword, setShowPassword] = useState(false);
  // console.log('errorLogin', errorLogin);
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  useEffect(() => {
    if (accessToken !== null) {
      navigate('/shipper/orderListShipper');
    }
  }, [accessToken]);

  const LoginShipperSchema = yup.object().shape({
    email: yup.string().required('Vui lòng nhập địa chỉ email !'),
    password: yup.string().required('Vui lòng nhập mật khẩu !'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginShipperSchema,
    onSubmit: (values) => {
      console.log('values', values);

      dispatch(login(values));
    },
  });
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, getFieldProps } = formik;
  return (
    <div className="px-3 h-screen mx-auto text-center bg-white md:w-96">
      <Box
        sx={{
          maxWidth: 580,

          display: 'flex',
          marginTop: '120px',
          padding: '40px',
          flexDirection: 'column',
          justifyContent: 'center',

          boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 5px 2px',
          borderRadius: '15px',
          border: '1px solid white',
        }}
      >
        <Box className="flex center mt-6 mb-4 mx-auto">
          <img src="../../../../img/User_Circle.png" alt="" style={{ width: '80px', height: '80px' }} />
        </Box>
        <Typography variant="h4" gutterBottom className="text-center mb-12" sx={{ marginBottom: '20px' }}>
          Đăng nhập
        </Typography>
        <p className="text-xs">Email: 12345@gmail.com , Pass: 02112000</p>

        <FormikProvider value={formik}>
          <Form className="px-4">
            <Stack spacing={3} sx={{ marginBottom: '20px' }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                name="email"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                fullWidth
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                label="Mật khẩu"
                name="password"
                {...getFieldProps('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
            </Stack>

            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              sx={{ padding: '0 !important' }}
              className="p-0"
            >
              Đăng nhập
            </Button>
          </Form>
        </FormikProvider>
      </Box>
    </div>
  );
}
