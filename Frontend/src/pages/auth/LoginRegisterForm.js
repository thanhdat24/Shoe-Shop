import { useEffect, useState } from 'react';

// firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Stack,
  Dialog,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  AppBar,
  Tab,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// firebase
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';

import { RHFCheckbox, RHFRadioGroup, RHFSelect, RHFTextField, FormProvider } from '../../components/hook-form';
import { LoginForm } from '../../sections/auth/login';
import { RegisterForm } from '../../sections/auth/register';
import { useDispatch } from '../../redux/store';
import useAuth from '../../hooks/useAuth';
import { setSession } from '../../utils/jwt';
import { auth } from '../../utils/firebase';

// ----------------------------------------------------------------------    

// Configure Firebase.
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // ...
}; 
firebase.initializeApp(config);

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
  // const [user, setUser] = useState();
  const { registerUser } = useAuth();
  const dispatch = useDispatch();
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        return;
      }
      console.log('user', user);
      const accessToken = await user.getIdToken();
      console.log('accessToken ', accessToken);

      if (user) {
        const newUser = {
          fullName: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          googleId: user.uid,
          dateOfBirth: '',
          gender: '',
          phoneNumber: user.phoneNumber,
        };
        setSession(accessToken);
        dispatch({
          type: 'LOGIN',
          payload: {
            user: newUser,
          },
        });
        // setUser(user);
        await registerUser(newUser);
      }
    });
    return () => unregisterAuthObserver();
  }, [dispatch]);


  const NewAddressSchema = Yup.object().shape({
    receiver: Yup.string().required('Fullname is required'),
    phone: Yup.string().required('Phone is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
  });

  const defaultValues = {
    addressType: 'Home',
    receiver: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    isDefault: true,
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      onNextStep();
      onCreateBilling({
        receiver: data.receiver,
        phone: data.phone,
        fullAddress: `${data.address}, ${data.city}, ${data.state}, ${data.country}, ${data.zipcode}`,
        addressType: data.addressType,
        isDefault: data.isDefault,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const [signInWithGoogle, _user, _loading, error] = useSignInWithGoogle(auth);

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
