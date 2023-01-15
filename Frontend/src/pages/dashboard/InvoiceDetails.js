import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getShippers } from '../../redux/slices/shipper';
import { getOrderDetail, getOrders } from '../../redux/slices/order';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _invoices } from '../../_mock';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import Invoice from '../../sections/@dashboard/invoice/details';

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { shippers, shipperDetail } = useSelector((state) => state.shipper);
  const { orders, orderDetai, orderUpdate } = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(getOrders());
    dispatch(getOrderDetail(id));
    dispatch(getShippers());
  }, [dispatch]);
  console.log('orderDetail');
  useEffect(() => {
    dispatch(getOrders());
  }, [orderUpdate]);

  const invoice = orders?.find((invoice) => invoice?.id === id);
  console.log('shippers34', shippers);
  return (
    <>
      <HeaderBreadcrumbs
        heading="Chi tiết đơn hàng"
        links={[
          { name: 'Trang chủ', href: PATH_DASHBOARD.root },
          {
            name: 'Đơn hàng',
            href: PATH_DASHBOARD.invoice.root,
          },
          { name: id || '' },
        ]}
      />

      <Invoice invoice={invoice} shippers={shippers} />
    </>
    //  <Page title="Invoice: View">
    //  <Container maxWidth={themeStretch ? false : 'md'}>

    //   </Container>
    // </Page>
  );
}
