import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router';

export default function ShipperLayout() {
  return (
    <div className="h-full">
      <div
        className=" mx-auto text-center bg-white relative"
        style={{
          boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 5px 2px',
          position: 'relative',
          border: '1px solid white',
          // maxWidth: '475px',
          margin: { xs: 2.5, md: 3 },
          '& > *': {
            flexGrow: 1,
            flexBasis: '50%',
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            margin: '0px 0px',
            height: '728px',
          }}
        >
          <Outlet />
        </Box>
      </div>
    </div>
  );
}
