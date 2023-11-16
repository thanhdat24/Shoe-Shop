import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// notistack
import { useSnackbar } from 'notistack';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import { useSelector } from '../../../redux/store';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { login } = useAuth();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const { errorLogin } = useSelector((state) => state.admin);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email phải là địa chỉ email hợp lệ').required('Email là bắt buộc'),
    password: Yup.string().required('Password là bắt buộc'),
  });

  const defaultValues = {
    email: '',
    password: '',
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

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      enqueueSnackbar('Đăng nhập thành công!');
      navigate(PATH_DASHBOARD.general.analytics);
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} mb={3}>
        {' '}
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
      </Stack>

      <Stack spacing={3}>
        <RHFTextField
          // color="secondary"
          sx={{
            backgroundColor: '#262c49 !important',
            '& label.Mui-focused': {
              color: '#7367f0',
            },
            '& label': {
              color: '#c2c6dc',
              fontSize: '16px',
            },
            '& .MuiInputBase-input': {
              color: '#c2c6dc',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#262c49',
              },
              '&:hover fieldset': {
                borderColor: '#7367f0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#7367f0',
              },
            },
          }}
          name="email"
          label="Tài khoản"
        />

        <RHFTextField
          name="password"
          label="Mật khẩu"
          sx={{
            backgroundColor: '#262c49 !important',
            '& label.Mui-focused': {
              color: '#7367f0',
            },
            '& label': {
              color: '#c2c6dc',
              fontSize: '16px',
            },
            '& .MuiInputBase-input': {
              color: '#c2c6dc',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#262c49',
              },
              '&:hover fieldset': {
                borderColor: '#7367f0',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#7367f0',
              },
            },
          }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify sx={{ color: '#c2c6dc' }} icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        sx={{
          my: 3,
          backgroundColor: '#7367f0 !important',
          fontSize: '15px',
          '&:hover': {
            borderColor: '#5e50ee!important',
            boxShadow: '0 8px 25px -8px #7367f0',
          },
        }}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Đăng nhập
      </LoadingButton>
    </FormProvider>
  );
}
