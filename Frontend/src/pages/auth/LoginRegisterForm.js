import { useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Box, Dialog, Button, Divider, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// firebase
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useSnackbar } from 'notistack';

import { RHFCheckbox, RHFRadioGroup, RHFSelect, RHFTextField, FormProvider } from '../../components/hook-form';
import { LoginForm } from '../../sections/auth/login';
import { RegisterForm } from '../../sections/auth/register';
import { useDispatch } from '../../redux/store';
import useAuth from '../../hooks/useAuth';
import { AUTH } from '../../contexts/FirebaseContext';

// ----------------------------------------------------------------------

LoginRegisterForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onNextStep: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function LoginRegisterForm({ open, onClose, onNextStep, onCreateBilling }) {
  const { user, registerUser } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  useEffect(() => {
    console.log('userForm', user);
    try {
      if (user.displayName !== undefined) {
        registerUser(user);
        setTimeout(() => {
          onClose();
          enqueueSnackbar('Đăng nhập thành công!');
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, user]);

  // const { user } = useAuth();
  const [signInWithGoogle, _user, _loading, error] = useSignInWithGoogle(AUTH);

  const google = () => {
    signInWithGoogle();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ marginBottom: 2, textAlign: 'center', fontSize: '23px !important' }} fontSize={36}>
        Chào mừng bạn đến với Shop Shoes!
      </DialogTitle>
      <DialogContent>
        <div className="w-3/5 my-0 mx-auto">
          <div>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              onClick={google}
              sx={{
                backgroundColor: '#DC4E42',
                justifyContent: 'space-between',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#E37168',
                },
                margin: '10px 0',
                fontWeight: '400',
                fontSize: '14px',
              }}
            >
              <img
                src="/logo/logo_social_google.svg"
                alt="google"
                width="22"
                height="22"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(1%) hue-rotate(184deg) brightness(103%) contrast(102%)',
                }}
              />
              <div className="normal-case">Tiếp tục với Google</div>
              <div className="opacity-0">T</div>
            </Button>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              // onClick={google}
              sx={{
                backgroundColor: '#2D88FF',
                justifyContent: 'space-between',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#57A0FF',
                },
                fontSize: '14px',
                fontWeight: '400',
                margin: '10px 0',
              }}
            >
              <img
                src="/logo/logo_social_facebook.svg"
                alt="google"
                width="22"
                height="22"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(1%) hue-rotate(184deg) brightness(103%) contrast(102%)',
                }}
              />
              <div className="normal-case">Tiếp tục với Facebook</div>
              <div className="opacity-0">T</div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
