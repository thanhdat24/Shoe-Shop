import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Card, Container, Divider, Grid, Tab, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Iconify from '../components/Iconify';
import Markdown from '../components/Markdown';
import Page from '../components/Page';
import { SkeletonProduct } from '../components/skeleton';
import useSettings from '../hooks/useSettings';
import { addCart, getProduct, onGotoStep, resetProduct } from '../redux/slices/product';
import { getProductRating } from '../redux/slices/rating';
import { useDispatch, useSelector } from '../redux/store';
import { ProductDetailsCarousel, ProductDetailsSummary } from '../sections/@dashboard/e-commerce/product-details';
import ProductDetailsReview from './ProductDetailsReview';

// ----------------------------------------------------------------------

const PRODUCT_DESCRIPTION = [
  {
    title: 'Đổi hàng trong 10 ngày',
    description:
      'Nếu sản phẩm không đáp ứng được nhu cầu của bạn, bạn có thể đổi hàng trong vòng 10 ngày kể từ ngày mua.',
    icon: 'ic:round-verified',
  },
  {
    title: 'Bảo hành 1 năm',
    description: 'Bảo hành sản phẩm trong 1 năm từ ngày mua để đảm bảo chất lượng và sự hài lòng của khách hàng.',
    icon: 'eva:clock-fill',
  },
  {
    title: '100% hàng chính hãng',
    description: 'Chúng tôi cam kết cung cấp sản phẩm chính hãng 100%, đảm bảo chất lượng và uy tín của thương hiệu.',
    icon: 'ic:round-verified-user',
  },
];

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  justifyContent: 'center',
  height: theme.spacing(8),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

// ----------------------------------------------------------------------

export default function Product() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [value, setValue] = useState('1');
  const { product, error, checkout } = useSelector((state) => state.product);
  const { productRatingList } = useSelector((state) => state.rating);
  const { name = '' } = useParams();
  useEffect(() => {
    dispatch(getProduct(name));
    return dispatch(resetProduct());
  }, [dispatch, name]);
  useEffect(() => {
    if (product) dispatch(getProductRating(product?._id));
    // return dispatch(resetProduct());
  }, [dispatch, product]);

  const handleAddCart = (product) => {
    dispatch(addCart(product));
  };

  const handleGotoStep = (step) => {
    dispatch(onGotoStep(step));
  };

  return (
    <Page title="Ecommerce: Product Details">
      <Container maxWidth={themeStretch ? false : 'lg'} sx={{ marginTop: 10 }}>
        {product && (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <ProductDetailsCarousel product={product} />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <ProductDetailsSummary
                    product={product}
                    ratingList={productRatingList !== null && productRatingList}
                    cart={checkout.cart}
                    onAddCart={handleAddCart}
                    onGotoStep={handleGotoStep}
                  />
                </Grid>
              </Grid>
            </Card>

            <Grid container sx={{ my: 8 }}>
              {PRODUCT_DESCRIPTION.map((item) => (
                <Grid item xs={12} md={4} key={item.title}>
                  <Box sx={{ my: 2, mx: 'auto', maxWidth: 280, textAlign: 'center' }}>
                    <IconWrapperStyle>
                      <Iconify icon={item.icon} width={36} height={36} />
                    </IconWrapperStyle>
                    <Typography variant="subtitle1" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{item.description}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Card sx={{ marginBottom: 5 }}>
              <TabContext value={value}>
                <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
                  <TabList onChange={(e, value) => setValue(value)}>
                    <Tab disableRipple value="1" label="Nội dung" />
                    <Tab
                      disableRipple
                      value="2"
                      // label={`Đánh giá`}
                      label={`Đánh giá (${productRatingList?.totalReview})`}
                      sx={{ '& .MuiTab-wrapper': { whiteSpace: 'nowrap' } }}
                    />
                  </TabList>
                </Box>

                <Divider />

                <TabPanel value="1">
                  <Box sx={{ p: 3 }}>
                    <Markdown children={product.desc} />
                  </Box>
                </TabPanel>
                <TabPanel value="2">
                  <ProductDetailsReview product={productRatingList} />
                </TabPanel>
              </TabContext>
            </Card>
          </>
        )}

        {!product && <SkeletonProduct />}

        {error && <Typography variant="h6">404 Product not found</Typography>}
      </Container>
    </Page>
  );
}
