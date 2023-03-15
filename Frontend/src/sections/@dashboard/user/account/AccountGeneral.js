import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';

// components
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { resetAdmin, updateCurrentUser } from '../../../../redux/slices/admin';
import { useDispatch, useSelector } from '../../../../redux/store';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const { error, success } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  useEffect(() => {}, []);
  useEffect(() => {
    if (error) {
      console.log('error', error);
      enqueueSnackbar('Cập nhật không thành công!', { variant: 'error' });
    } else if (success) {
      enqueueSnackbar('Cập nhật thành công!');
    }
    setTimeout(() => {
      dispatch(resetAdmin());
    }, 2000);
  }, [error, success]);

  const { user } = useAuth();

  const UpdateUserSchema = Yup.object().shape({
    // displayName: Yup.string().required('displayName is required'),
  });

  const defaultValues = {
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    // console.log("data",data)
    // const newCurrentAdmin = {
    //   ...data
    // };
    try {
      dispatch(updateCurrentUser(data));
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
      // Đem dữ liệu file lưu vào formik
      //  formik.setFieldValue('photo', file);
      // if (file) {
      //   setValue(
      //     'photoURL',
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
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
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
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="displayName" label="Name" />
              <RHFTextField disabled name="email" label="Email Address" />

              <RHFTextField name="phoneNumber" label="Phone Number" />
              <RHFTextField name="address" label="Address" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
