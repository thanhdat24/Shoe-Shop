import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  InputAdornment,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TableContainer,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAllCate, getAllColor, getAllSize, getProducts } from '../../../redux/slices/product';
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

const GENDER_OPTION = ['Men', 'Women'];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

const steps = ['Select campaign settings', 'Create an ad group'];
export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const [activeStep, setActiveStep] = useState(0);
  const [productUpdate, setNewProductUpdate] = useState({});
  const [arrayNewProduct, setArrayNewProduct] = useState();

  const isStepOptional = (step) => {
    return step === 1;
  };
  console.log('step', steps);
  console.log('activeStep', activeStep);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCate());
    dispatch(getAllSize());
    dispatch(getAllColor());
  }, [dispatch]);

  const { cates, sizes, colors, productSave } = useSelector((state) => state.product);
  // cate
  const cateName = [];
  cates.map((item) => {
    return cateName.push(item.name);
  });
  // size
  console.log('sizes', sizes);
  console.log('productSave', productSave);
  const nameSize = [];
  sizes.map((item) => {
    return nameSize.push(item.name);
  });
  console.log('sizes', sizes);

  const CATEGORY_OPTION = [{ group: 'Giày', classify: cates }];
  const SIZE_OPTION = sizes;

  // const SIZE_OPTION = nameSize;

  console.log('SIZE_OPTION', SIZE_OPTION);
  console.log('colors', colors);
  console.log('CATEGORY_OPTION', CATEGORY_OPTION);
  // color
  const colorName = [];
  colors.map((item) => {
    return colorName.push(item.name);
  });
  const COLOR_OPTION = colors;

  console.log('COLOR_OPTION', COLOR_OPTION);
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    desc: Yup.string().required('Description is required'),
    // images: Yup.array().min(1, 'Images is required'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      desc: currentProduct?.description || '',
      images: currentProduct?.images || [],
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || 0,
      priceSale: currentProduct?.priceSale || 0,
      size: currentProduct?.tags || [],
      color: currentProduct?.tags || [],
      gender: currentProduct?.gender || GENDER_OPTION[1],
      category: currentProduct?.category || '',
      origin: currentProduct?.category || '',
      material: currentProduct?.material || '',
      supplier: currentProduct?.supplier || '',
      quantity: Number(currentProduct?.quantity) || 0,
      style: currentProduct?.style || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const onSubmit = async (product) => {
    let newProduct = {};
    newProduct = {
      ...product,
    };
    // console.log('newProduct123123', newProduct);

    try {
      if (newProduct !== undefined) {
        // console.log('productUpdatew35', productUpdate);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setActiveStep(1);
        // console.log('productUpdatew3', productUpdate);
        const arrayItemProduct = [];
        for (let i = 0; i < newProduct?.size.length; i += 1) {
          for (let j = 0; j < newProduct?.color.length; j += 1) {
            const itemProduct = {
              id: Math.random() * 5,
              name: newProduct.name,
              desc: newProduct.desc,
              images: newProduct.images,
              sku: newProduct.sku,
              price: newProduct.price,
              priceSale: newProduct.priceSale,
              gender: newProduct.gender,
              category: newProduct.category,
              origin: newProduct.origin,
              material: newProduct.material,
              supplier: newProduct.supplier,
              quantity: newProduct.quantity,
              style: newProduct.style,
              color: newProduct.color[j],
              size: newProduct.size[i],
            };
            arrayItemProduct.push(itemProduct);
          }
        }
        setArrayNewProduct(arrayItemProduct);
      }
      // reset();
      // enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      // navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error(error);
    }
  };

  // console.log('productTruoc', productUpdate);
  console.log('arrayNewProduct', arrayNewProduct);

  // const { name } = arrayNewProduct.size;
  function getFullName(params) {
    return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
  }

  function setFullName(params) {
    const [firstName, lastName] = params.value.toString().split(' ');
    return { ...params.row, firstName, lastName };
  }

  function parseFullName(value) {
    return String(value)
      .split(' ')
      .map((str) => (str.length > 0 ? str[0].toUpperCase() + str.slice(1) : ''))
      .join(' ');
  }
  const columns = [
    {
      field: 'size',
      headerName: 'Phiên bản/gói',
      width: 130,
      editable: true,
      valueGetter: ({ value }) => value.name,
      // valueGetter: getFullName,
      // valueSetter: setFullName,
      // valueParser: parseFullName,
    },
    { field: 'sku', headerName: 'Sku', width: 130, editable: true },
    {
      field: 'priceSale',
      headerName: 'Giá bán',
      width: 160,
      editable: true,
    },
    {
      field: 'price',
      headerName: 'Giá so sánh',
      width: 160,
      editable: true,

      sortComparator: (v1, v2) => v1.toString().localeCompare(v2.toString()),
    },
    {
      field: 'quantity',
      headerName: 'Số lượng',
      width: 130,
      editable: true,
    },
  ];


  console.log('columns', columns);
  const handleDrop = useCallback(
    (acceptedFiles) => {
      setValue(
        'images',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };

  return (
    <Box>
      {' '}
      {activeStep === 0 ? (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <RHFTextField name="name" label="Product Name" />

                  <div>
                    <LabelStyle>Description</LabelStyle>
                    <RHFEditor simple name="desc" />
                  </div>
                  <Grid container rowSpacing={1} columns={17}>
                    <Grid xs={8} mr={5}>
                      <RHFTextField name="sku" label="SKU" />
                      <RHFTextField name="origin" label="Xuất sứ" sx={{ margin: '10px 0' }} />
                      <RHFTextField name="material" label="Chất liệu" />
                    </Grid>
                    <Grid xs={8}>
                      <RHFTextField name="style" label="Kiểu dáng" />
                      <RHFTextField name="supplier" label="Nhà cung cấp" sx={{ margin: '10px 0' }} />
                      <RHFTextField
                        name="quantity"
                        label="Số lượng"
                        onChange={(event) => setValue('quantity', Number(event.target.value))}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          type: 'number',
                        }}
                      />
                    </Grid>
                  </Grid>

                  <div>
                    <LabelStyle>Images</LabelStyle>
                    <RHFUploadMultiFile
                      name="images"
                      showPreview
                      accept="image/*"
                      maxSize={3145728}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                    />
                  </div>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={2} mt={1}>
                    <div>
                      <LabelStyle>Gender</LabelStyle>
                      <RHFRadioGroup
                        name="gender"
                        options={GENDER_OPTION}
                        sx={{
                          '& .MuiFormControlLabel-root': { mr: 4 },
                        }}
                      />
                    </div>

                    {/* <RHFSelect name="country" label="Country" placeholder="Country">
                  <option value="" />
                  {countries.map((option) => (
                    <option key={option.code} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect> */}

                    <RHFSelect name="category" label="Category">
                      {CATEGORY_OPTION?.map((category) => (
                        <optgroup key={category.group} label={category.group}>
                          {category?.classify.map((classify) => (
                            <option key={classify} value={classify.id}>
                              {classify.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </RHFSelect>

                    <Controller
                      name="size"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          freeSolo
                          onChange={(event, newValue) => field.onChange(newValue)}
                          options={SIZE_OPTION.map((options) => options)}
                          getOptionLabel={(option) => option.name}
                          renderTags={(value, getTagProps) =>
                            value.map((options, index) => (
                              <Chip {...getTagProps({ index })} key={options._id} size="small" label={options.name} />
                            ))
                          }
                          renderInput={(params) => <TextField label="Kích thước" {...params} />}
                        />
                      )}
                    />
                    <Controller
                      name="color"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          freeSolo
                          getOptionLabel={(option) => option.name}
                          onChange={(event, newValue) => field.onChange(newValue)}
                          options={COLOR_OPTION.map((option) => option)}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                              <Chip {...getTagProps({ index })} key={option._id} size="small" label={option.name} />
                            ))
                          }
                          renderInput={(params) => <TextField label="Màu sắc" {...params} />}
                        />
                      )}
                    />
                  </Stack>
                </Card>

                <Card sx={{ p: 3 }}>
                  <Stack spacing={3} mb={2}>
                    <RHFTextField
                      name="price"
                      label="Giá so sánh"
                      placeholder="0.00"
                      value={getValues('price') === 0 ? '' : getValues('price')}
                      onChange={(event) => setValue('price', Number(event.target.value))}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                        type: 'number',
                      }}
                    />
                    <RHFTextField
                      name="priceSale"
                      label="Giá giảm"
                      placeholder="0.00"
                      value={getValues('priceSale') === 0 ? '' : getValues('priceSale')}
                      onChange={(event) => setValue('priceSale', Number(event.target.value))}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                        type: 'number',
                      }}
                    />
                  </Stack>
                </Card>

                <LoadingButton
                  // onClick={setTimeout(() => ( handleNext)
                  // , 3000)}
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  {!isEdit ? 'Create Product' : 'Save Changes'}
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </FormProvider>
      ) : (
        <Box>
          <Card>
            <TableContainer sx={{ minWidth: 800 }}>
              {' '}
              <Typography variant="h4" className="text-green-500 uppercase " ml={2} mt={2}>
                Nhập liệu
              </Typography>
              {/* {productUpdate.name} */}
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={arrayNewProduct} columns={columns} />
              </div>
            </TableContainer>{' '}
          </Card>
        </Box>
      )}
      <Box className="absolute top-32 right-24">
        {activeStep !== 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button variant="contained" color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
