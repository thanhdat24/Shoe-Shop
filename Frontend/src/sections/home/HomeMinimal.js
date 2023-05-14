import { useEffect, useState } from 'react';
import { m } from 'framer-motion';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Container, Typography, Pagination, Stack } from '@mui/material';
// components
import { MotionViewport, varFade } from '../../components/animate';
import { ShopProductList } from '../@dashboard/e-commerce/shop';
import { getProducts } from '../../redux/slices/product';
import { useDispatch, useSelector } from '../../redux/store';

// ----------------------------------------------------------------------


const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(15),
  },
}));

// ----------------------------------------------------------------------

export default function HomeMinimal() {
  const dispatch = useDispatch();

  const theme = useTheme();
  const { products } = useSelector((state) => state.product);
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    dispatch(getProducts(page));
  }, [dispatch, page]);

  return (
    <RootStyle>
      <Container component={MotionViewport}>
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 2, md: 5 },
          }}
        >
          <m.div variants={varFade().inDown}>
            <Typography variant="h2">Sản phẩm mới nhất</Typography>
          </m.div>
        </Box>

        <ShopProductList products={products.data} loading={!products.result} />
        <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: 5 }}>
          {' '}
          <Pagination count={3} page={page} onChange={handleChange} color="primary" />
        </Stack>
      </Container>
    </RootStyle>
  );
}
