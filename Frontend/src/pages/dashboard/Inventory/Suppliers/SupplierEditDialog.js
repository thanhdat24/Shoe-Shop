import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// @mui
import {
  Box,
  Stack,
  Dialog,
  Button,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import ModalDialog from '../../../../components/ModalDialog/DialogTitle';
import { province } from '../../../../_mock';

import { useDispatch, useSelector } from '../../../../redux/store';
import { resetSupplier, updateSupplier } from '../../../../redux/slices/supplier';

SupplierEditDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  supplierDetail: PropTypes.object,
  supplierId: PropTypes.string,
};

export default function SupplierEditDialog({ open, onClose, supplierDetail, supplierId }) {
  const dispatch = useDispatch();
  console.log('supplierDetail', supplierDetail);
  const [districtList, setDistrictList] = useState([]);
  const { updateSupplierSuccess } = useSelector((state) => state.supplier);
  console.log('province', province);
  const [wardList, setWardList] = useState([]);
  const defaultValues = useMemo(
    () => ({
      id: supplierDetail?.id || '',
      name: supplierDetail?.name || '',
      address: supplierDetail?.address || '',
      city: supplierDetail?.city || '',
      district: supplierDetail?.district || '',
      ward: supplierDetail?.ward || '',
      contactName: supplierDetail?.contactName || '',
      contactPhone: supplierDetail?.contactPhone || '',
      contactEmail: supplierDetail?.contactEmail || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [supplierDetail]
  );

  const methods = useForm({ defaultValues });

  const { reset, watch, setValue, control, handleSubmit, resetField } = methods;

  useEffect(() => {
    if (supplierId && supplierDetail) {
      reset(defaultValues);
    }
    if (!supplierId) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierId, supplierDetail]);

  const values = watch();

  const onSubmit = async (data) => {
    const fullAddress = data?.address || '' + data?.ward || '' + data?.district || '' + data?.city || '';
    try {
      console.log('data');
      dispatch(updateSupplier({ ...data, fullAddress }, supplierId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    resetField();
    onClose();
  };

  // useEffect(() => {
  //   if (updateSupplierSuccess) {
  //     enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
  //     resetField();
  //     onClose();

  //   }
  // }, [updateSupplierSuccess]);
  return (
    <FormProvider methods={methods}>
      <Dialog fullWidth maxWidth="md" open={open} sx={{ zIndex: '10000' }} onClose={handleCloseModal}>
        <ModalDialog onClose={handleCloseModal}> Chỉnh sửa thông tin liên hệ</ModalDialog>
        <hr />
        <DialogContent className="!py-4">
          <div className="mb-4  font-semibold  text-base">Thông tin chung</div>
          <Stack spacing={1} sx={{ fontSize: 14 }}>
            <Box sx={{ display: 'grid', gridTemplateRows: '1fr 3fr', alignItems: 'center' }}>
              <Box className="flex text-gray-500 font-semibold mb-1">Tên nhà cung cấp</Box>
              <RHFTextField name="name" label="Điền tên nhà cung cấp" />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateRows: '1fr 3fr', alignItems: 'center' }}>
              <Box className="flex text-gray-500 font-semibold mb-1">Địa chỉ</Box>
              <RHFTextField name="address" label="Điền địa chỉ" />
            </Box>
            <Stack direction="row" spacing={1}>
              <Box sx={{ display: 'grid', gridTemplateRows: '1fr 3fr', alignItems: 'center', width: '100%' }}>
                <Box className="flex text-gray-500 font-semibold mb-1">Tỉnh/Thành phố</Box>
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
              </Box>
              <Box sx={{ display: 'grid', gridTemplateRows: '1fr 3fr', alignItems: 'center', width: '100%' }}>
                <Box className="flex text-gray-500 font-semibold mb-1">Quận/Huyện</Box>
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
              </Box>
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateRows: '1fr 3fr', alignItems: 'center' }}>
              <Box className="flex text-gray-500 font-semibold mb-1">Phường/ Xã</Box>
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
            </Box>
          </Stack>
          <hr />
          <div className="mt-4 mb-4 text-base font-semibold ">Người Liên Hệ</div>
          <Stack spacing={1} sx={{ fontSize: 14 }}>
            <Box sx={{ display: 'grid', gridTemplateRows: '1fr 3fr', alignItems: 'center' }}>
              <Box className="flex text-gray-500 font-semibold mb-1">Tên người liên hệ</Box>
              <RHFTextField name="contactName" label="Điền tên người liên hệ" />
            </Box>
            <Stack direction="row" spacing={1}>
              <Box sx={{ display: 'grid', gridTemplateRows: '1fr 3fr', alignItems: 'center', width: '100%' }}>
                <Box className="flex text-gray-500 font-semibold mb-1">Địa chỉ email</Box>
                <RHFTextField name="contactEmail" label="Nhập địa chỉ email" />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateRows: '1fr 3fr', alignItems: 'center', width: '100%' }}>
                <Box className="flex text-gray-500 font-semibold mb-1">Số điện thoại</Box>
                <RHFTextField name="contactPhone" label="Nhập số điện thoại" />
              </Box>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
            <Button
              sx={{
                color: 'gray',
                borderColor: 'gray ',
                '&:hover': { color: 'primary.main' },
                padding: '6px 13px !important',
                fontWeight: '700 !important',
                lineHeight: '1.71429 !important',
                fontSize: '0.8rem !important',
                textTransform: 'none !important',
                height: '38px !important',
              }}
              variant="outlined"
              onClick={handleCloseModal}
            >
              Hủy
            </Button>
            <Button
              sx={{
                padding: '6px 13px !important',
                fontWeight: '700 !important',
                lineHeight: '1.71429 !important',
                fontSize: '0.8rem !important',
                textTransform: 'none !important',
                height: '38px !important',
              }}
              size="large"
              variant="contained"
              // disabled={!isDisabledSave}
              onClick={handleSubmit(onSubmit)}
            >
              Lưu
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
