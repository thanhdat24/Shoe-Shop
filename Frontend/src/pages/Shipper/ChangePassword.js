import React from 'react';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Typography } from '@mui/material';
// components
import { Link, NavLink as RouterLink } from 'react-router-dom';
import { FormProvider, RHFTextField } from '../../components/hook-form';
import Iconify from '../../components/Iconify';
import useAuth from '../../hooks/useAuth';

export default function ChangePassword() {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Mật khẩu cũ là bắt buộc'),
    newPassword: Yup.string().min(6, 'Mật khẩu phải ít nhất 6 kí tự').required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Mật khẩu phải trùng khớp'),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Card
        sx={{
          height: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'inherit !important',
          backgroundColor: 'orange',
        }}
      >
        <Box sx={{ position: 'absolute', top: '17%', left: '30px', color: '#fff' }}>
          <Link component={RouterLink} to="/shipper/dashboard">
            <Iconify icon={'eva:arrow-ios-back-fill'} width={25} height={25} />
          </Link>
        </Box>
        <Box sx={{ position: 'absolute', top: '17%', fontWeight: 600, color: '#fff' }}>Thay đổi mật khẩu</Box>
        <Box className="absolute h-28 w-28 rounded-full left-1/2 transform  translate-y-1/2 -translate-x-1/2 border-4 border-white ring-4 ring-green-400 0 cursor-pointer">
          <Box className="relative flex-shrink-0 w-full h-full">
            <img
              className="h-full w-full select-none bg-white rounded-full object-cover flex-shrink-0 filter hover:brightness-110"
              src={user.photoURL}
              alt="photoURL"
              referrerpolicy="no-referrer"
            />
          </Box>
        </Box>
      </Card>

      <Box sx={{ width: '100%', marginTop: 6, marginBottom: 3 }}>
        <Typography variant="h5">{user.displayName}</Typography>
        <Typography variant="subtitle3">{user.email}</Typography>
      </Box>

      <Box sx={{ width: '100%', marginTop: 6, marginBottom: 3 }}>
        <Card sx={{ p: 3, m: 1 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} alignItems="flex-end">
              <RHFTextField name="oldPassword" type="password" label="Mật khẩu cũ" />

              <RHFTextField name="newPassword" type="password" label="Mật khẩu mới" />

              <RHFTextField name="confirmNewPassword" type="password" label="Nhập lại mật khẩu mới" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Thay đổi
              </LoadingButton>
            </Stack>
          </FormProvider>
        </Card>
      </Box>
    </>
  );
}
