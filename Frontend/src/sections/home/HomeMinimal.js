import { m } from 'framer-motion';
import { useEffect, useState } from 'react';
// @mui
import { Link as RouterLink } from 'react-router-dom';

import { Box, Container, Link, Pagination, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
// components
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { MotionViewport, varFade } from '../../components/animate';
import { getProducts } from '../../redux/slices/product';
import { useDispatch, useSelector } from '../../redux/store';
import { PATH_HOME } from '../../routes/paths';
import { isCurrentDateGreaterThanSevenDays } from '../../utils/formatTime';
import { ShopProductList } from '../@dashboard/e-commerce/shop';

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
    dispatch(getProducts());
  }, [dispatch, page]);
  const newProducts = products.data?.filter((item) => !isCurrentDateGreaterThanSevenDays(item.createdAt));

  const startIndex = (page - 1) * 8;
  const endIndex = startIndex + 8;
  const paginatedProducts = newProducts?.slice(startIndex, endIndex);
  const totalPages = Math.ceil(newProducts?.length / 8);

  const linkTo = PATH_HOME.search.viewAll;
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ opacity: '0' }}>Xem tất cả</Box>

              <Typography variant="h2">Sản phẩm mới nhất</Typography>
              <Link to={linkTo} color="gray" component={RouterLink} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box className="mr-1">Xem tất cả</Box>
                <ArrowForwardIosIcon
                  sx={{ color: 'gray', width: '14px', height: '14px' }}
                  style={{ fontSize: '16px !important' }}
                />
              </Link>
            </Box>
          </m.div>
        </Box>

        <ShopProductList products={paginatedProducts} loading={!newProducts?.length} />
        <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', marginTop: 5 }}>
          {' '}
          <Pagination count={totalPages} page={page} onChange={handleChange} color="primary" />
        </Stack>
      </Container>
    </RootStyle>
  );
}
