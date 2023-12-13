// form
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Box, Container, Pagination, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useSearchParams } from 'react-router-dom';
import { FormProvider } from '../components/hook-form';
import useSettings from '../hooks/useSettings';
import { getBrands } from '../redux/slices/brand';
import { getObjects } from '../redux/slices/objectUse';
import { filterProducts, getAllCate, getAllColor, getAllSize, searchGender } from '../redux/slices/product';
import { useDispatch, useSelector } from '../redux/store';
import { ShopFilterSidebar, ShopProductList, ShopTagFiltered } from '../sections/@dashboard/e-commerce/shop';

// ---------------------------------------------------

const MIN_AMOUNT = 1000000;
const MAX_AMOUNT = 10000000;
const STEP = 1000000;

export default function SearchGender() {
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();

  const gender = searchParams.get('gender');

  const priceGte = searchParams.get('price_gte');

  const priceLte = searchParams.get('price_lte');

  useEffect(() => {
    dispatch(getAllCate());
    dispatch(getAllSize());
    dispatch(getAllColor());
    dispatch(getObjects());
    dispatch(getBrands());
  }, [dispatch]);

  const [page, setPage] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const { themeStretch } = useSettings();

  const [openFilter, setOpenFilter] = useState(false);

  const { filters, cates, colors, sizes, searchList } = useSelector((state) => state.product);

  const { objects } = useSelector((state) => state.objectUse);
  const FILTER_GENDER_OPTIONS = objects;

  // cate
  const cateName = [];
  cates.map((item) => {
    return cateName.push(item.name);
  });
  const FILTER_CATEGORY_OPTIONS = cates;

  // color
  const colorName = [];
  colors.map((item) => {
    return colorName.push(item.name);
  });
  const FILTER_COLOR_OPTIONS = colors;

  const filteredProducts = applyFilter(searchList, filters, priceGte, priceLte, page, 6);

  const defaultValues = {
    gender: filters.gender,
    category: filters.category,
    colors: filters.colors,
    priceRange: filters.priceRange,
    rating: filters.rating,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, setValue } = methods;

  const values = watch();

  const isDefault =
    !values.priceRange &&
    !values.rating &&
    values.gender.length === 0 &&
    values.colors.length === 0 &&
    values.category === 'All';

  useEffect(() => {
    dispatch(filterProducts(values));
  }, [dispatch, values]);

  const handleResetFilter = () => {
    reset();
  };

  const handleRemoveGender = (value) => {
    const newValue = filters.gender.filter((item) => item !== value);
    setValue('gender', newValue);
  };

  const handleRemoveCategory = () => {
    setValue('category', 'All');
  };

  const handleRemoveColor = (value) => {
    const newValue = filters.colors.filter((item) => item !== value);
    setValue('colors', newValue);
  };

  const handleRemovePrice = () => {
    setValue('priceRange', '');
  };

  const handleRemoveRating = () => {
    setValue('rating', '');
  };

  const [productPrice, setProductPrice] = useState();

  useEffect(() => {
    dispatch(searchGender(gender));
  }, [dispatch, gender]);

  return (
    <Box className="pt-24">
      <Container maxWidth="lg" sx={{ padding: '50px auto', backgroundColor: 'white', display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              border: '1px solid white',
              height: '720px',
              boxShadow: ' rgb(0 0 0 / 10%) 0px 0px 5px 2px',
              marginRight: '20px',
              borderRadius: '15px',
              marginBottom: '24px',
              backgroundColor: 'white',
              width: '320px',
            }}
          >
            <FormProvider methods={methods}>
              <ShopFilterSidebar
                onResetAll={handleResetFilter}
                FILTER_CATEGORY_OPTIONS={FILTER_CATEGORY_OPTIONS}
                FILTER_COLOR_OPTIONS={FILTER_COLOR_OPTIONS}
                FILTER_GENDER_OPTIONS={FILTER_GENDER_OPTIONS}
              />
            </FormProvider>
          </Box>
        </Box>

        <Box
          sx={{
            border: '1px solid white',
            padding: '10px',
            boxShadow: ' rgb(0 0 0 / 10%) 0px 0px 5px 2px',
            width: '100%',
            borderRadius: '15px',
            marginBottom: '24px',
            backgroundColor: 'white',
          }}
        >
          <Box
            sx={{
              backgroundColor: '#57b159',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box className="flex">
              <ManageSearchIcon sx={{ color: 'white', marginRight: '10px' }} />
              <Typography sx={{ color: 'white' }} variant="subtitle1">
                Tất cả sản phẩm dành cho <strong className="text-md">'{gender}'</strong>
              </Typography>
            </Box>

            <Typography component="div" variant="subtitle3" sx={{ color: 'white' }}>
              Có <strong>{filteredProducts?.totalCount ? filteredProducts?.totalCount : 0}</strong> sản phẩm phù hợp với
              tiêu chí của bạn
            </Typography>
          </Box>

          <Stack sx={{ mb: 3 }}>
            {!isDefault && (
              <ShopTagFiltered
                filters={filters}
                isShowReset={!isDefault && !openFilter}
                onRemoveGender={handleRemoveGender}
                onRemoveCategory={handleRemoveCategory}
                onRemoveColor={handleRemoveColor}
                onRemovePrice={handleRemovePrice}
                onRemoveRating={handleRemoveRating}
                onResetAll={handleResetFilter}
              />
            )}
          </Stack>

          {productPrice ? (
            <Box>
              {' '}
              <ShopProductList isSearch products={productPrice} />
              <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: 5 }}>
                {' '}
                <Pagination count={filteredProducts?.totalPages} page={page} onChange={handleChange} color="primary" />
              </Stack>
            </Box>
          ) : (
            <Box>
              <ShopProductList isSearch products={filteredProducts?.data} />
              <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: 5 }}>
                <Pagination count={filteredProducts?.totalPages} page={page} onChange={handleChange} color="primary" />
              </Stack>
            </Box>
          )}

          {(productPrice?.length === 0 || filteredProducts?.length === 0) && (
            <Box className="flex flex-col w-full mt-3">
              <p className="text-center text-2xl ">Không tìm thấy sản phẩm nào</p>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

function applyFilter(products, filters, priceGte, priceLte, page, pageSize) {
  const stabilizedThis = products?.map((el, index) => [el, index]);
  products = stabilizedThis?.map((el) => el[0]);
  // FILTER PRODUCTS
  if (filters.gender.length > 0) {
    products = products.filter((product) => filters.gender.includes(product.idObjectUse.name));
  }
  if (filters.category !== 'All') {
    products = products?.filter((product) => product.idCate.name === filters.category);
  }
  if (filters.colors.length > 0) {
    products = products.filter((product) =>
      product.productDetail.some((detail) => filters.colors.includes(detail.idColor.color))
    );
  }
  if (priceGte || priceLte) {
    products = products?.filter((item) => priceGte <= item.price && item.price <= priceLte);
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = products?.slice(startIndex, endIndex);

  return {
    totalCount: products?.length,
    totalPages: Math.ceil(products?.length / pageSize),
    currentPage: page,
    pageSize,
    data: paginatedProducts,
  };
}
