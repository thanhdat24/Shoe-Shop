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
  TableBody,
  Table,
  Paper,
} from '@mui/material';
import _ from 'lodash';
import { DataGrid } from '@mui/x-data-grid';
import {
  createProduct,
  getAllCate,
  getAllColor,
  getAllSize,
  getProducts,
  updateProduct,
} from '../../../redux/slices/product';
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
import { TableEmptyRows, TableHeadCustom, TableSkeleton } from '../../../components/table';
import { ProductTableRow } from './product-list';
import ProductDetailTableRow from './ProductDetailTableRow';
import useTable from '../../../hooks/useTable';
import { getObjects } from '../../../redux/slices/objectUse';
import { getBrands } from '../../../redux/slices/brand';
import { getSuppliers } from '../../../redux/slices/supplier';
// ----------------------------------------------------------------------

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
  console.log('currentProduct', currentProduct);
  const [activeStep, setActiveStep] = useState(0);
  const [arrayNewProduct, setArrayNewProduct] = useState();

  const isStepOptional = (step) => {
    return step === 1;
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      dispatch(createProduct(arrayNewProduct));
      enqueueSnackbar('Nhập liệu thành công!', { variant: 'success' });
      navigate(PATH_DASHBOARD.eCommerce.list);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCate());
    dispatch(getAllSize());
    dispatch(getAllColor());
    dispatch(getObjects());
    dispatch(getBrands());
    dispatch(getSuppliers());
  }, [dispatch]);

  const { cates, sizes, colors, productSave } = useSelector((state) => state.product);
  const { objects } = useSelector((state) => state.objectUse);
  const { brandList } = useSelector((state) => state.brand);
  const { supplierList } = useSelector((state) => state.supplier);
  const GENDER_OPTION = objects;
  const BRAND_OPTION = brandList;
  const SUPPLIER_OPTION = supplierList;
  const CATEGORY_OPTION = cates;
  // size

  const nameSize = [];
  sizes.map((item) => {
    return nameSize.push(item.name);
  });

  const SIZE_OPTION = sizes;

  // color
  const colorName = [];
  colors.map((item) => {
    return colorName.push(item.name);
  });

  const COLOR_OPTION = colors;
  const color = _(currentProduct?.productDetail)
    .groupBy((x) => x.idColor.name)
    .map((value, key) => ({
      nameColor: key,
      color: value,
    }))
    .value();

  const newArrColor = [];
  color.map((item, index) => {
    return newArrColor.push({
      name: item.nameColor,
      _id: item.color[0]?.idColor._id,
      color: item.color[0]?.idColor.color,
    });
  });

  const sizesProduct = _(currentProduct?.productDetail)
    .groupBy((x) => x.idSize.name)
    .map((value, key) => ({
      name: key,
      nameSize: value,
    }))
    .value();

  const newArrSize = [];
  sizesProduct.map((item, index) => {
    return newArrSize.push({
      name: item.name,
      _id: item.nameSize[0]?.idSize._id,
    });
  });

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    desc: Yup.string().required('Description is required'),
    // images: Yup.array().min(1, 'Images is required'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentProduct?.id || '',
      name: currentProduct?.name || '',
      desc: currentProduct?.desc || '',
      productImages: currentProduct?.productImages[0]?.url || [],
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || 0,
      priceSale: currentProduct?.priceSale || 0,
      size: newArrSize || [],
      color: newArrColor || [],
      gender: currentProduct?.gender || '63a727483405383becabeace',
      brand: currentProduct?.brand || '63a71f26f1922e39c4b6072e',
      category: currentProduct?.category || '63a7121263850a28288a0449',
      origin: currentProduct?.origin || '',
      material: currentProduct?.material || '',
      supplier: currentProduct?.supplier || '63e524118c060f3b14d32fef',
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
    try {
      if (newProduct !== undefined && !isEdit) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setActiveStep(1);
        const arrayItemProduct = [];
        let index = 0;

        for (let i = 0; i < newProduct?.size.length; i += 1) {
          for (let j = 0; j < newProduct?.color.length; j += 1) {
            index += 1;
            const itemProduct = {
              name: newProduct.name,
              desc: newProduct.desc,
              productImages: newProduct.productImages,
              sku: `${newProduct.sku}-${index}`,
              price: newProduct.price,
              priceSale: newProduct.priceSale,
              idObjectUse: newProduct.gender,
              objectUseName: objects.find((item) => item._id === newProduct.gender),
              idCate: newProduct.category,
              idBrand: newProduct.brand,
              origin: newProduct.origin,
              material: newProduct.material,
              idSupplier: newProduct.supplier,
              quantity: newProduct.quantity,
              style: newProduct.style,
              idColor: newProduct.color[j],
              idSize: newProduct.size[i],
            };
            arrayItemProduct.push(itemProduct);
          }
        }
        setArrayNewProduct(arrayItemProduct);
      } else {
        dispatch(updateProduct(newProduct, newProduct.id));
        enqueueSnackbar('Chỉnh sửa thành công!', { variant: 'success' });
        navigate(PATH_DASHBOARD.eCommerce.list);
      }
      // reset();
      // enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      // navigate(PATH_DASHBOARD.eCommerce.list);
    } catch (error) {
      console.error(error);
    }
  };

  const [images, setImages] = useState([]);
  const imageTypeRegex = /image\/(png|jpg|jpeg|svg)/gm;
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles;
      const gallery = [];
      const imageGallery = [];
      file.forEach((item, index) => {
        if (item.type.match(imageTypeRegex)) {
          gallery.push(item);
        }
      });
      if (gallery.length) {
        gallery.forEach((file) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);

          fileReader.onload = (e) => {
            //  const { result } = e.target;
            if (e.target.result) {
              imageGallery.push(e.target.result);
            }
            if (imageGallery.length === gallery.length) {
              setImages(imageGallery);
            }

            setValue('productImages', imageGallery);
          };
        });
      }
    },
    [setValue]
  );

  const handleRemoveAll = () => {
    setValue('productImages', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('productImages', filteredItems);
  };

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const TABLE_HEAD = [
    { id: 'sku', label: 'Sku', align: 'left' },
    { id: 'version', label: 'Phiên bản/gói', align: 'left' },
    { id: 'quantity', label: 'Số lượng', align: 'left' },
    { id: 'price', label: 'Giá bán', align: 'left' },
    { id: 'priceSale', label: 'Giá so sánh', align: 'left' },
    // { id: 'price', label: 'Giá', align: 'right' },
  ];

  return (
    <Box>
      {' '}
      {activeStep === 0 ? (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <RHFTextField name="name" label="Tên sản phẩm" />

                  <div>
                    <LabelStyle>Mô tả</LabelStyle>
                    <RHFEditor simple name="desc" />
                  </div>
                  <Grid container rowSpacing={1} columns={17}>
                    <Grid xs={8} mr={5}>
                      <RHFTextField disabled={isEdit && true} name="sku" label="SKU" />
                      <RHFTextField name="origin" label="Xuất sứ" sx={{ margin: '10px 0' }} />
                      <RHFTextField name="material" label="Chất liệu" />
                    </Grid>
                    <Grid xs={8}>
                      <RHFTextField name="style" label="Kiểu dáng" />
                      <RHFSelect name="supplier" label="Nhà cung cấp" sx={{ margin: '10px 0' }}>
                        {SUPPLIER_OPTION?.map((supplier) => (
                          <option key={supplier._id} value={supplier._id}>
                            {supplier.name}
                          </option>
                        ))}
                      </RHFSelect>
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
                    <LabelStyle>Hình ảnh</LabelStyle>
                    <RHFUploadMultiFile
                      name="productImages"
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
                      <LabelStyle>Giới tính</LabelStyle>
                      <RHFRadioGroup
                        name="gender"
                        options={GENDER_OPTION}
                        sx={{
                          '& .MuiFormControlLabel-root': { mr: 4 },
                        }}
                      />
                    </div>
                    <RHFSelect name="category" label="Loại giày">
                      {CATEGORY_OPTION?.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </RHFSelect>
                    <RHFSelect name="brand" label="Loại giày">
                      {BRAND_OPTION?.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </RHFSelect>{' '}
                    <Controller
                      name="size"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          multiple
                          disabled={isEdit && true}
                          freeSolo
                          onChange={(event, newValue) => field.onChange(newValue)}
                          options={SIZE_OPTION.map((options) => options)}
                          getOptionLabel={(option) => option.name.toString()}
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
                          disabled={isEdit && true}
                          getOptionLabel={(option) => option.name.toString()}
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
                  {!isEdit ? 'Tạo sản phẩm' : 'Lưu thay đổi'}
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
              <Typography variant="h4" className="text-green-500 uppercase " ml={2} mt={2} mb={2}>
                Nhập liệu
              </Typography>
              {/* {productUpdate.name} */}
              {/* <div style={{ height: 400, width: '100%' }}>
                <DataGrid rows={arrayNewProduct} columns={columns} />
              </div> */}
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  // order={order}
                  // orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={arrayNewProduct?.length}
                  // numSelected={selected.length}
                  // onSort={onSort}
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.id)
                  //   )
                  // }
                />

                <TableBody>
                  {arrayNewProduct?.map((row, index) => (
                    <ProductDetailTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      // onSelectRow={() => onSelectRow(row.id)}
                      // onDeleteRow={() => handleDeleteRow(row.id)}
                      // onEditRow={() => handleEditRow(row.name)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>{' '}
          </Card>
        </Box>
      )}
      <Box className="absolute top-32 right-24">
        {activeStep !== 0 && activeStep !== steps.length && (
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button variant="contained" color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
              Trở về
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button variant="contained" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Hoàn tất' : 'Trở về'}
            </Button>
          </Box>
        )}
        {/* {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button sx={{ mt: 1, mr: 1 }}>Reset</Button>
          </Paper>
        )} */}
      </Box>
    </Box>
  );
}
