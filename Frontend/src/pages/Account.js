import React, { useMemo } from 'react';
import * as Yup from 'yup';

import { Grid, Container, Typography, Box, Stack, Card, TextField } from '@mui/material';
import { DatePicker, LoadingButton } from '@mui/lab';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFSelect, RHFTextField } from '../components/hook-form';
import Page from '../components/Page';
import useSettings from '../hooks/useSettings';
import useAuth from '../hooks/useAuth';

export default function Account() {
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  console.log('user1234', user);

  const NewUserSchema = Yup.object().shape({});

  const defaultValues = {
    displayName: user?.displayName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    console.log('data', data);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(error);
    }
  };
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
