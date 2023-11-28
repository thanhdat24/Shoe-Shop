import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Box, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../../sections/@dashboard/user/UserNewEditForm';
import { getUsers } from '../../../redux/slices/admin';

// ----------------------------------------------------------------------

export default function UserCreate() {
  const dispatch = useDispatch();

  const { themeStretch } = useSettings();

  const { pathname } = useLocation();

  const { id = '' } = useParams();

  const isEdit = pathname.includes('edit');

  const { accountList } = useSelector((state) => state.admin);

  const currentAdmin = accountList?.find((admin) => admin._id === id);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  return (
    <Page title="User: Create a new user">
      <Box sx={{ padding: '0px 10px' }}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo nhân viên mới' : 'Chỉnh sửa nhân viên'}
          links={[
            { name: 'Trang chủ', href: PATH_DASHBOARD.root },
            { name: 'Nhân viên', href: PATH_DASHBOARD.user.list },
            { name: !isEdit ? 'Nhân viên mới' : id },
          ]}
        />

        <UserNewEditForm isEdit={isEdit} currentAdmin={currentAdmin} />
      </Box>
    </Page>
  );
}
