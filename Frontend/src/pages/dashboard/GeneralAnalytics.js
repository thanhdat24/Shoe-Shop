// @mui
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Card, Container, Grid, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import { AnalyticsCurrentVisits, AnalyticsWidgetSummary } from '../../sections/@dashboard/general/analytics';

import { getAllAccounts } from '../../redux/slices/admin';
import { getOrders, getTotalRevenue } from '../../redux/slices/order';
import { getAllProduct } from '../../redux/slices/product';
import AnalyticsProduct from '../../sections/@dashboard/general/analytics/AnalyticsProduct';
import { formatPriceInVND } from '../../utils/formatNumber';
// ----------------------------------------------------------------------

export default function GeneralAnalytics() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { allAccountsList } = useSelector((state) => state.admin);
  const { orders, totalRevenue } = useSelector((state) => state.order);
  const { productList } = useSelector((state) => state.product);
  useEffect(() => {
    dispatch(getOrders());
    dispatch(getAllAccounts());
    dispatch(getTotalRevenue());
    dispatch(getAllProduct());
  }, [dispatch]);
  const totalPrice = orders?.reduce((total, item) => {
    if (item.status === 'Đã nhận' || item.status === 'Đã đánh giá') {
      total += item.total;
    }
    return total;
  }, 0);

  return (
    <Page title="General: Analytics">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Thống kê
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', flexDirection: 'column' }}>
              <Box className="text-base font-semibold bg-[rgb(208,242,255)] w-full py-3">Hôm nay</Box>
              <Box className="py-3">
                <Box className="mb-2">Doanh thu: {formatPriceInVND(totalRevenue?.totalRevenueToday)}</Box>
                <Box>Nhập: {formatPriceInVND(totalRevenue?.totalReceiptToday)}</Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', flexDirection: 'column' }}>
              <Box className="text-base font-semibold bg-[rgb(208,242,255)] w-full py-3">Tuần này</Box>
              <Box className="py-3">
                <Box className="mb-2">Doanh thu: {formatPriceInVND(totalRevenue?.totalRevenueThisWeek)}</Box>
                <Box>Nhập: {formatPriceInVND(totalRevenue?.totalReceiptThisWeek)}</Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', flexDirection: 'column' }}>
              <Box className="text-base font-semibold bg-[rgb(208,242,255)] w-full py-3">Tháng này</Box>
              <Box className="py-3">
                <Box className="mb-2">Doanh thu: {formatPriceInVND(totalRevenue?.totalRevenueThisMonth)}</Box>
                <Box>Nhập: {formatPriceInVND(totalRevenue?.totalReceiptThisMonth)}</Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', flexDirection: 'column' }}>
              <Box className="text-base font-semibold bg-[rgb(208,242,255)] w-full py-3">Năm nay</Box>
              <Box className="py-3">
                <Box className="mb-2">Doanh thu: {formatPriceInVND(totalRevenue?.totalRevenueThisYear)}</Box>
                <Box>Nhập: {formatPriceInVND(totalRevenue?.totalReceiptThisYear)}</Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsWidgetSummary
              title="Đơn hàng"
              total={orders?.length}
              icon={'ant-design:shopping-cart-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsWidgetSummary
              title="Người dùng"
              total={allAccountsList?.length}
              color="info"
              icon={'ant-design:user-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsWidgetSummary
              title="Sản phẩm"
              total={productList?.length}
              color="primary"
              icon={'ant-design:code-sandbox-outlined'}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsCurrentVisits />
          </Grid>
          <Grid item xs={12} md={12} lg={8}>
            <AnalyticsProduct />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
