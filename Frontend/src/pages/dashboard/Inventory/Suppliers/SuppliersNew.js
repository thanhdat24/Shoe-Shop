import { useEffect, useState } from 'react';

import { Autocomplete, Box, Card, Container, Grid, Stack, TextField } from '@mui/material';
import * as Yup from 'yup';

// import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

// routes
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import SaveCancelButtons from '../../../../components/SaveCancelButtons/SaveCancelButtons';
import { getDistricts, getListProvince, getWard } from '../../../../redux/slices/address';
import { createSupplier, resetSupplier } from '../../../../redux/slices/supplier';
import { PATH_DASHBOARD } from '../../../../routes/paths';

export default function SuppliersNew() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [districtList, setDistrictList] = useState([]);

  const [province, setProvince] = useState([]);

  const [wardList, setWardList] = useState([]);

  const { newSupplier, error, isLoading } = useSelector((state) => state.supplier);

  const CreateSchema = Yup.object().shape({
    name: Yup.string().required('*Vui lòng nhập thông tin này'),
  });
  const defaultValues = {
    name: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  };
  const methods = useForm({
    resolver: yupResolver(CreateSchema),
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
      dispatch(createSupplier(data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar('Tạo nhà cung cấp không thành công!', { variant: 'error' });
    } else if (newSupplier) {
      enqueueSnackbar('Tạo nhà cung cấp thành công!');
      navigate(PATH_DASHBOARD.inventory.suppliers);
    }
    setTimeout(() => {
      dispatch(resetSupplier());
    }, 3000);
  }, [error, newSupplier]);

  useEffect(async () => {
    const data = await getListProvince();
    if (data.status === 200) {
      setProvince(data.data);
    }
  }, []);

  useEffect(async () => {
    const data = await getDistricts(values.city.code);
    if (data.status === 200) {
      setDistrictList(data.data.districts);
    }
  }, [values.city && values.city.code]);

  useEffect(async () => {
    const data = await getWard(values.district?.code);
    if (data.status === 200) {
      setWardList(data.data.wards);
    }
  }, [values.district && values.district.code]);

  const [isReadyCreateSupplier, setIsReadyCreateSupplier] = useState(false);
  useEffect(() => {
    if (values.name) setIsReadyCreateSupplier(true);
    else setIsReadyCreateSupplier(false);
  }, [values.name]);

  return (
    <Container sx={{ paddingRight: '0px !important', paddingLeft: '0px !important' }}>
      <Box className="mb-5">
        <Box className="text-lg leading-6 font-semibold">Thông tin nhà cung cấp</Box>
        <Box>Vui lòng cung cấp các thông tin về nhà cung cấp sẽ tạo</Box>
      </Box>
      <Box sx={{ width: '100%', typography: 'body1', marginTop: 2 }}>
        <FormProvider methods={methods}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={8} sx={{ marginBottom: '80px' }}>
              <Card
                sx={{
                  borderRadius: ' 16px',
                  zIndex: 0,
                  padding: '24px',
                }}
              >
                <div className="mb-4 text-lg font-semibold  ">Thông tin chung</div>
                <Stack spacing={1}>
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
                            isOptionEqualToValue={(option, value) => option.code === value.code}
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
                            isOptionEqualToValue={(option, value) => option.code === value.code}
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
                          isOptionEqualToValue={(option, value) => option.code === value.code}
                          getOptionLabel={(option) => option.name || ''}
                          onChange={(event, newValue) => field.onChange(newValue)}
                          options={wardList?.map((options) => options)}
                          renderInput={(params) => <TextField label="Phường/Xã" {...params} />}
                        />
                      )}
                    />
                  </Box>
                </Stack>
              </Card>
              <Card
                sx={{
                  borderRadius: ' 16px',
                  zIndex: 0,
                  padding: '24px',
                  marginTop: '20px',
                }}
              >
                <div className="mb-4 text-lg font-semibold ">Người Liên Hệ</div>
                <Stack spacing={1}>
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
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card
                sx={{
                  borderRadius: ' 16px',
                  zIndex: 0,
                  padding: '24px 0 ',
                }}
              >
                <div className="px-3">
                  <div className="mb-3 text-lg font-semibold">Ghi chú</div>

                  <hr />
                </div>
              </Card>
            </Grid>
          </Grid>
          <SaveCancelButtons
            onSave={handleSubmit(onSubmit)}
            isDisabledSave={isReadyCreateSupplier}
            onCancel={() => navigate(PATH_DASHBOARD.inventory.suppliers)}
          />
        </FormProvider>
      </Box>
    </Container>
  );
}
