import { Box, Card, Grid, ListItemIcon, Typography } from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import { Link, NavLink as RouterLink } from 'react-router-dom';
import Iconify from '../../components/Iconify';
import useAuth from '../../hooks/useAuth';
import { navInfoShipper } from './NavConfig';
import { ICON } from '../../config';

// ----------------------------------------
export const ListItemIconStyle = styled(ListItemIcon)({
  width: ICON.NAVBAR_ITEM,
  height: ICON.NAVBAR_ITEM,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': { width: '100%', height: '100%' },
  marginRight: '0px',
  //   color: 'white',
});

export default function Account() {
  const { user } = useAuth();
  return (
    <>
      <Card
        sx={{
          height: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // marginBottom: '20px',
          overflow: 'inherit !important',
          backgroundColor: 'orange',
        }}
      >
        <Box sx={{ position: 'absolute', top: '17%', left: '30px', color: '#fff' }}>
          <Link component={RouterLink} to="/shipper/dashboard">
            <Iconify icon={'eva:arrow-ios-back-fill'} width={25} height={25} />
          </Link>
        </Box>
        <Box sx={{ position: 'absolute', top: '17%', fontWeight: 600, color: '#fff' }}>Thông tin tài khoản</Box>
        <Box className="absolute h-28 w-28 rounded-full left-1/2 transform  translate-y-1/2 -translate-x-1/2 border-4 border-white ring-4 ring-green-400 0 cursor-pointer">
          <Box className="relative flex-shrink-0 w-full h-full">
            <img
              className="h-full w-full select-none bg-white rounded-full object-cover flex-shrink-0 filter hover:brightness-110"
              src={user.photoURL}
              alt="photoURL"
            />
          </Box>
        </Box>
      </Card>
      <Box sx={{ width: '100%', marginTop: 6, marginBottom: 3 }}>
        <Typography variant="h5">{user.displayName}</Typography>
        <Typography variant="subtitle3">{user.email}</Typography>
      </Box>

      {navInfoShipper.map((item) => (
        <Link component={RouterLink} to="/shipper/account">
          <Card p={3} sx={{ marginBottom: 2, m: 1 }}>
            <Grid container>
              <Grid item xs={2} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ListItemIconStyle>{item.icon}</ListItemIconStyle>
              </Grid>
              <Grid
                item
                xs={10}
                md={10}
                sx={{
                  padding: '10px 0px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                }}
              >
                <Typography align="left" variant="subtitle1">
                  {item.label}
                </Typography>

                <Typography align="left" variant="subtitle3">
                  {item.key === 'displayName' && user.displayName}
                  {item.key === 'dayOfBirth' && user.dayOfBirth}
                  {item.key === 'gender' && user.gender}
                  {item.key === 'phoneNumber' && user.phoneNumber}
                  {item.key === 'email' && user.email}
                  {item.key === 'licensePlates' && user.licensePlates}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Link>
      ))}
    </>
  );
}
