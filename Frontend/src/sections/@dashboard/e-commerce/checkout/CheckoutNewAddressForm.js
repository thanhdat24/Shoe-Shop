import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Stack,
  Dialog,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Autocomplete,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
// _mock
import { province } from '../../../../_mock';
import { FormProvider, RHFCheckbox, RHFSelect, RHFTextField, RHFRadioGroup } from '../../../../components/hook-form';
import { createAddress, getListProvince, getListWard } from '../../../../redux/slices/address';
import { useDispatch } from '../../../../redux/store';

// ----------------------------------------------------------------------

CheckoutNewAddressForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onNextStep: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

export default function CheckoutNewAddressForm({ open, onClose, onNextStep, onCreateBilling }) {
  const NewAddressSchema = Yup.object().shape({
    fullName: Yup.string().required('displayName is required'),
    phoneNumber: Yup.string().required('Phone is required'),
    address: Yup.string().required('Address is required'),
  });
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const defaultValues = {
    addressType: 'Nhà',
    fullName: '',
    phoneNumber: '',
    address: '',
    district: '',
    city: '',
    ward: '',
    isDefault: true,
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting },
  } = methods;
  const values = watch();
  const onSubmit = async (data) => {
    try {
      dispatch(createAddress(data));
      onClose();
      enqueueSnackbar('Thêm địa chỉ thành công!');
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(async () => {
    const data = await getListProvince(values.city?.idProvince);

    if (data.status === 200) {
      setDistrictList(data.data);
    }
  }, [values.city]);

  useEffect(async () => {
    const data = await getListWard(values.district?.idDistrict);

    if (data.status === 200) {
      setWardList(data.data);
    }
  }, [values.district]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle> Thông tin người nhận hàng</DialogTitle>
      {/* <Typography variant="h5" gutterBottom>
        Thông tin người nhận hàng
      </Typography> */}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="fullName" label="Họ và tên" />
              <RHFTextField name="phoneNumber" label="Số điện thoại" />
            </Box>
            <Typography variant="h6">Địa chỉ nhận hàng</Typography>

            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              {/* <RHFSelect name="city" label="Tỉnh / Thành phố">
                {province.map((option) => (
                  <option key={option.idProvince} value={option.idProvince}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect> */}
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    isOptionEqualToValue={(option, value) => option.idProvince === value.idProvince}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={province.map((options) => options)}
                    renderInput={(params) => <TextField label="Tỉnh/Thành phố" {...params} />}
                  />
                )}
              />

              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    isOptionEqualToValue={(option, value) => option.idDistrict === value.idDistrict}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={districtList?.map((options) => options)}
                    renderInput={(params) => <TextField label="Quận/Huyện" {...params} />}
                  />
                )}
              />

              <Controller
                name="ward"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    isOptionEqualToValue={(option, value) => option.idCommune === value.idCommune}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={wardList?.map((options) => options)}
                    renderInput={(params) => <TextField label="Phường/Xã" {...params} />}
                  />
                )}
              />

              <RHFTextField name="address" label="Địa chỉ cụ thể" />
            </Box>

            <RHFCheckbox name="isDefault" label="Sử dụng địa chỉ này làm địa chỉ mặc định." sx={{ mt: 3 }} />
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Huỷ bỏ
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Lưu địa chỉ
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
