// @mui
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import { AnalyticsCurrentVisits, AnalyticsWidgetSummary } from '../../sections/@dashboard/general/analytics';

import { getOrders } from '../../redux/slices/order';
import { fCurrency } from '../../utils/formatNumber';
import AnalyticsProduct from '../../sections/@dashboard/general/analytics/AnalyticsProduct';
import { getAllAccounts } from '../../redux/slices/admin';
// ----------------------------------------------------------------------

export default function GeneralAnalytics() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { allAccountsList } = useSelector((state) => state.admin);
  const { orders } = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(getOrders());
    dispatch(getAllAccounts());
  }, [dispatch]);
  console.log('allAccountsList', allAccountsList);
  const totalPrice = orders?.reduce((total, item) => {
    if (item.status === 'Đã nhận' || item.status === 'Đã giao hàng' || item.status === 'Đã đánh giá') {
      total += item.total;
    }
    return total;
  }, 0);

  console.log('orders', orders);
  console.log('totalPrice', totalPrice);
  return (
    <Page title="General: Analytics">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Thống kê
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Đơn hàng"
              total={orders?.length}
              icon={'ant-design:shopping-cart-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Người dùng"
              total={allAccountsList?.length}
              color="info"
              icon={'ant-design:user-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Doanh thu"
              total={fCurrency(totalPrice)}
              color="warning"
              icon={'ant-design:dollar-circle-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary title="Lượt truy cập" total={234} color="error" icon={'ant-design:eye-filled'} />
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
