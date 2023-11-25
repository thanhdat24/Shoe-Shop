import { useState } from 'react';
import { Outlet } from 'react-router-dom';

// @mui
import { Container, Tab, Box, Tabs, styled, Typography } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import MyAvatar from '../../components/MyAvatar';
import { NavSectionVertical } from '../../components/nav-section';
import { HEADER, NAVBAR } from '../../config';
// routes

import NavConfigAccount from '../dashboard/navbar/NavConfigAccount';
import { PATH_AUTH } from '../../routes/paths';
// components

// ----------------------------------------------------------------------

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: 10,
  //   paddingBottom: HEADER.MOBILE_HEIGHT + 24,
}));

export default function AccountLayoutLayout() {
  const { user } = useAuth();
  console.log('user123', user);

  const { themeStretch } = useSettings();

  const { collapseClick, isCollapse } = useCollapseDrawer();

  return (
    <Page title="Account" sx={{ marginTop: 10, backgroundColor: '#F5F5FA' }}>
      <Container
        //  maxWidth={themeStretch ? false : 'lg'}
        sx={{ maxWidth: ' 1260px !important' }}
      >
        <Box
          sx={{
            display: { lg: 'flex' },
            minHeight: { lg: 1 },
          }}
        >
          <Box>
            <HeaderBreadcrumbs
              heading=""
              sx={{ mb: 0 }}
              links={[{ name: 'Trang chủ', href: PATH_AUTH.home }, { name: 'Thông tin tài khoản' }]}
            />

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MyAvatar />

              <Box
                sx={{
                  ml: 2,
                  transition: (theme) =>
                    theme.transitions.create('width', {
                      duration: theme.transitions.duration.shorter,
                    }),
                  ...(isCollapse && {
                    ml: 0,
                    width: 0,
                  }),
                }}
              >
                <Typography variant="subtitle2" noWrap sx={{ color: 'text.secondary' }}>
                  Tài khoản của
                </Typography>
                <Typography variant="subtitle1" noWrap>
                  {user?.displayName || user?.phoneNumber}
                </Typography>
              </Box>
            </Box>

            <NavSectionVertical isNavUser="yes" navConfig={NavConfigAccount} isCollapse={isCollapse} />
          </Box>

          <MainStyle collapseClick={collapseClick}>
            <Outlet />
          </MainStyle>
        </Box>
      </Container>
    </Page>
  );
}
