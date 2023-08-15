import React from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, AppBar, Toolbar } from '@mui/material';
import { useStyles } from './SaveCancelButtonsStyle';
import { NAVBAR } from '../../config';
import cssStyles from '../../utils/cssStyles';

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar)(({ theme }) => ({
  ...cssStyles(theme).bgBlur(),
  height: '75px',
  zIndex: theme.zIndex.appBar + 100,
  [theme.breakpoints.up('lg')]: {
    height: '75px',
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
  },
}));

export default function SaveCancelButtons(props) {
  const classes = useStyles();

  const { onCancel, onSave, isDisabledSave, textCreate, ...other } = props;

  return (
    <RootStyle>
      <Toolbar
        sx={{
          minHeight: '100% !important',
          px: { lg: 5 },
        }}
      >
        <Box className="text-[#637381] text-lg font-bold"> Tạo mới chưa được lưu</Box>
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Button
            sx={{
              color: 'gray',
              borderColor: 'gray ',
              '&:hover': { color: 'primary.main' },
            }}
            variant="outlined"
            onClick={onCancel}
            className={classes.buttonCreate}
          >
            Hủy
          </Button>
          <LoadingButton
            size="large"
            variant="contained"
            disabled={!isDisabledSave}
            className={classes.buttonCreate}
            onClick={onSave}
          >
            {textCreate || 'Tạo mới'}
          </LoadingButton>
        </Stack>
      </Toolbar>
    </RootStyle>
  );
}

SaveCancelButtons.propTypes = {
  onCancel: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  isDisabledSave: PropTypes.bool.isRequired,
};
