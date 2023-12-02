import { useEffect, useMemo } from 'react';
import * as Yup from 'yup';

import { DatePicker, LoadingButton } from '@mui/lab';
import { Box, Card, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { FormProvider, RHFSelect, RHFTextField } from '../components/hook-form';
import useAuth from '../hooks/useAuth';
import useSettings from '../hooks/useSettings';
import { resetUser, updateCurrentUser } from '../redux/slices/user';
import { useDispatch, useSelector } from '../redux/store';
import { setUser } from '../utils/jwt';

export default function Account() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const NewUserSchema = Yup.object().shape({});
  const { updateUserSuccess } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      displayName: user?.displayName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (user) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const values = watch();

  const onSubmit = (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch(updateCurrentUser(data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (updateUserSuccess) {
      console.log('updateUserSuccess', updateUserSuccess);
      enqueueSnackbar('Cập nhật thành công!');
      setUser(updateUserSuccess.data);
      dispatch({
        type: 'INITIALISE',
        payload: { isAuthenticated: true, user: updateUserSuccess.data },
      });
    }
    return () => dispatch(resetUser());
  }, [updateUserSuccess]);

  return (
    <Box sx={{ paddingBottom: 10 }}>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid spacing={3}>
            <Card sx={{ padding: '23px' }}>
              <Typography variant="h4" sx={{ mb: 5 }}>
                Thông tin tài khoản
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <RHFTextField name="displayName" label="Họ tên" />
                <RHFTextField disabled name="email" label="Email " />
                <RHFTextField name="phoneNumber" label="Số điện thoại" />

                <RHFSelect name="gender" label="Giới tính" placeholder="Giới tính">
                  <option value="" />
                  {['Nam', 'Nữ'].map((option, index) => (
                    <option value={option}>{option}</option>
                  ))}
                </RHFSelect>

                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      label="Ngày sinh"
                      value={field.value}
                      onChange={(newValue) => {
                        field.onChange(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                      )}
                    />
                  )}
                />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Lưu thay đổi
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </FormProvider>
      </Container>
    </Box>
  );
}
