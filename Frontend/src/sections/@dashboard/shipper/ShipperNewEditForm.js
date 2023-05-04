import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import DatePicker from '@mui/lab/DatePicker';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, TextField } from '@mui/material';
import { createAdmin, resetAdmin } from '../../../redux/slices/admin';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { province } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

import { useDispatch, useSelector } from '../../../redux/store';
import { createShipper, resetShipper } from '../../../redux/slices/shipper';

// ----------------------------------------------------------------------

ShipperNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
};

export default function ShipperNewEditForm({ isEdit }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { newShipper, error } = useSelector((state) => state.shipper);
  useEffect(() => {
    if (error) {
      enqueueSnackbar('Thêm shipper không thành công!', { variant: 'error' });
    } else if (newShipper) {
      enqueueSnackbar('Thêm shipper  thành công!');
      navigate(PATH_DASHBOARD.shipper.list);
    }
    setTimeout(() => {
      dispatch(resetShipper());
    }, 3000);
  }, [error, newShipper]);

  const NewUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    gender: Yup.string().required('gender is required'),
    password: Yup.string().required('password is required'),
    passwordConfirm: Yup.string().required('passwordConfirm is required'),
    dateOfBirth: Yup.string().required('dateOfBirth is required'),
  });

  const defaultValues = useMemo(
    () => ({
      displayName: '',
      email: '',
      photoURL: '',
      phoneNumber: '',
      address: '',
      gender: '',
      password: '',
      passwordConfirm: '',
      dateOfBirth: '',
      licensePlates: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  const onSubmit = async (account) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      await dispatch(createShipper(account));
      // reset();
      // enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        // sau khi thực hiên xong lênh trên thì set giá trị có được
        setValue('photoURL', e.target.result);
      };
      // if (file) {
      //   setValue(
      //     'photoURLUrl',
      //     Object.assign(file, {
      //       preview: URL.createObjectURL(file),
      //     })
      //   );
      // }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {isEdit && (
              <Label
                color={values.status !== 'active' ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="photoURL"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Cho phép *.jpeg, *.jpg, *.png, *.gif
                    <br /> tối đa {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) => field.onChange(event.target.checked ? 'banned' : 'active')}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="displayName" label="Họ tên" />
              <RHFTextField name="email" label="Email " />
              <RHFTextField name="phoneNumber" label="Số điện thoại" />

              <RHFSelect name="gender" label="Giới tính" placeholder="Giới tính">
                <option value="" />
                {['Nam', 'Nữ'].map((option, index) => (
                  <option value={option}>{option}</option>
                ))}
              </RHFSelect>

              <RHFTextField name="password" label="Mật khẩu" />
              <RHFTextField name="passwordConfirm" label="Xác nhận mật khẩu" />
              <RHFTextField name="address" label="Địa chỉ" />
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
              <RHFTextField name="licensePlates" label="Biển số xe" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Tạo Shipper' : 'Lưu thay đổi'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
