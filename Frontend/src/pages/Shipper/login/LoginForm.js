import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// notistack
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Link,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Grid,
  useMediaQuery,
  Button,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH, PATH_DASHBOARD, PATH_SHIPPER } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';

import { login } from '../../../redux/slices/shipperManage';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const theme = useTheme();

  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: 'shipper@gmail.com',
    password: '02112000',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (value) => {
    try {
      const data = await login(value);
      console.log('data', data);
      enqueueSnackbar('Đăng nhập thành công!');
      navigate(PATH_SHIPPER.shipper.root);
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <Grid container direction="column" justifyContent="center" spacing={2}>
      <Grid item xs={12}>
        <Button
          disableElevation
          fullWidth
          //   onClick={googleHandler}
          size="large"
          variant="outlined"
          sx={{
            color: 'grey.700',
            backgroundColor: theme.palette.grey[50],
            borderColor: theme.palette.grey[100],
          }}
        >
          <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
            <img
              src="../logo/logo_social_google.svg"
              alt="google"
              width={16}
              height={16}
              style={{ marginRight: matchDownSM ? 8 : 16 }}
            />
          </Box>
          Sign in with Google
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

          <Button
            variant="outlined"
            sx={{
              cursor: 'unset',
              m: 2,
              py: 0.5,
              px: 7,
              borderColor: `${theme.palette.grey[100]} !important`,
              color: `${theme.palette.grey[900]}!important`,
              fontWeight: 500,
            }}
            disableRipple
            disabled
          >
            OR
          </Button>

          <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
        </Box>
      </Grid>
      <Grid item xs={12} container alignItems="center" justifyContent="center">
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Đăng nhập bằng địa chỉ Email</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

            <RHFTextField name="email" label="Email" />

            <RHFTextField
              name="password"
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <RHFCheckbox name="remember" label="Quên mật khẩu" />
            <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
              Quên mật khẩu?
            </Link>
          </Stack>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            Đăng nhập
          </LoadingButton>
        </FormProvider>
      </Grid>
    </Grid>
  );
}
