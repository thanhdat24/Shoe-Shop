import PropTypes from 'prop-types';
import SimpleBarReact from 'simplebar-react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ isNavBar }) => ({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
  backgroundColor: isNavBar ? '#111c43' : undefined,
  color: isNavBar ? '#a3aed1' : undefined,
}));

const SimpleBarStyle = styled(SimpleBarReact)(({ theme, isNavBar }) => ({
  color: isNavBar ? '#a3aed1 !important' : undefined,
  maxHeight: '100%',
  '& .simplebar-scrollbar': {
    '&:before': {
      backgroundColor: isNavBar ? alpha(theme.palette.grey[600], 0.48) : undefined,
    },
    '&.simplebar-visible:before': {
      opacity: 1,
    },
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 10,
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 6,
  },
  '& .simplebar-mask': {
    zIndex: 'inherit',
  },
}));

// ----------------------------------------------------------------------

Scrollbar.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
  isNavBar: PropTypes.bool, // Thêm kiểu prop 'isNavBar' kiểu bool
};

export default function Scrollbar({ children, sx, isNavBar, ...other }) {
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (isMobile) {
    return (
      <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <RootStyle isNavBar={isNavBar}>
      <SimpleBarStyle isNavBar={isNavBar} timeout={500} clickOnTrack={false} sx={sx} {...other}>
        {children}
      </SimpleBarStyle>
    </RootStyle>
  );
}
