import { paramCase, capitalCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections

import ShipperNewEditForm from '../../sections/@dashboard/shipper/ShipperNewEditForm';

// ----------------------------------------------------------------------

export default function ShipperCreate() {
  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { name = '' } = useParams();

  const isEdit = pathname.includes('edit');

  return (
    <Page title="User: Create a new shipper">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo shipper mới' : 'Chỉnh sửa shipper'}
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Shipper', href: PATH_DASHBOARD.shipper.list },
            { name: !isEdit ? 'Shipper mới' : capitalCase(name) },
          ]}
        />

        <ShipperNewEditForm isEdit={isEdit} />
      </Container>
    </Page>
  );
}
