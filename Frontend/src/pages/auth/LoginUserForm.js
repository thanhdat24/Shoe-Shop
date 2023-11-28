import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Dialog,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
} from '@mui/material';
import OtpInput, { ResendOTP } from 'otp-input-react';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';
// firebase
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';

import { LoginForm } from '../../sections/auth/login';
import { RegisterForm } from '../../sections/auth/register';
import { useDispatch } from '../../redux/store';
import useAuth from '../../hooks/useAuth';
// import { AUTH } from '../../contexts/FirebaseContext';
import { AUTH } from '../../firebaseConfig';
import { setSession, setUser } from '../../utils/jwt';

// ----------------------------------------------------------------------

LoginUserForm.propTypes = {
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

export default function LoginUserForm({ open, onClose, onNextStep, onCreateBilling }) {
  const navigate = useNavigate();
  const { user, registerUser, loginFacebook, verifyOTP } = useAuth();
  const [errorLoginOTP, setErrorLoginOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [activeError, setActiveError] = useState('');
  const [expandForm, setExpandForm] = useState(false);
  const [OTP, setOTP] = useState('');
  console.log('OTP', OTP);
  const { enqueueSnackbar } = useSnackbar();

  const [openFormPhone, setOpenFormPhone] = useState(false);

  const handleChangePhone = (e) => {
    setPhoneNumber(e.target.value);
  };

  const renderButton = (buttonProps) => {
    return (
      <button
        className={`mt-10  text-[13px] ${
          buttonProps.remainingTime !== 0 ? 'text-[#D2D2D2] cursor-not-allowed' : 'text-blue-500'
        }`}
        {...buttonProps}
        onClick={handleSendOTP}
      >
        {buttonProps.remainingTime !== 0 ? `Gửi lại mã sau ${buttonProps.remainingTime}s` : 'Gửi lại mã'}
      </button>
    );
  };
  const renderTime = () => React.Fragment;

  const onCaptchVerify = async () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha',
        {
          size: 'invisible',
          callback: (response) => {},
          'expired-callback': () => {},
        },
        AUTH
      );
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10 && phoneNumber.length !== 0) {
      setActiveError('Vui lòng nhập đúng định dạng số điện thoại');
    } else if (phoneNumber.length === 0) {
      setActiveError('Vui lòng nhập số điện thoại');
    } else {
      setActiveError('');
      setExpandForm(true);
      onCaptchVerify();
      const formatPhone = '+84' + phoneNumber.slice(1);
      const appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(AUTH, formatPhone, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          // enqueueSnackbar('Gửi OTP thành công');
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  };

  useEffect(() => {
    if (OTP.length !== 6) return;
    window.confirmationResult
      .confirm(OTP)
      .then((result) => {
        console.log('result', result);
        const { user } = result;
        const getUser = async () => {
          await fetch('http://127.0.0.1:8080/api/v1/otps/verifyOTP', {
            method: 'POST',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
              phoneNumber: user.phoneNumber,
              phoneId: result._tokenResponse.localId,
              photoURL: 'https://res.cloudinary.com/web-app-shoes/image/upload/v1700406437/qcoepcjavj4ixnhrck9k.png',
            }),
          })
            .then((response) => {
              console.log('response', response);
              if (response.status === 200) return response.json();
              throw new Error('authentication has been failed!');
            })
            .then((resObject) => {
              console.log('resObject', resObject);
              if (resObject?.user.active) {
                // setSession(resObject.token);
                // setUser(resObject);
                enqueueSnackbar('Đăng nhập thành công');
                onClose();
                if (resObject) {
                  navigate('/');
                }
              } else {
                enqueueSnackbar('Tài khoản của bạn đã bị khóa!', { variant: 'error' });

                navigate('/');
              }
              // if (resObject?.user.active) {
              //   dispatch({
              //     type: 'LOGIN_USER',
              //     payload: {
              //       data: resObject,
              //     },
              //   });
              //   localStorage.setItem('user', JSON.stringify(resObject));
              //   localStorage.setItem('token', resObject.token);
              //   if (resObject) {
              //     history.push('/');
              //   }
              // } else {
              //   Swal.fire({
              //     icon: 'error',
              //     title: 'Lỗi...',
              //     text: 'Tài khoản của bạn đã bị khóa!',
              //   });
              //   history.push('/');
              // }
            })
            .catch((err) => {
              console.log('err', err);
            });
        };
        getUser();
      })
      .catch((err) => {
        setErrorLoginOTP(true);
        console.log('err', err);
      });
  }, [OTP]);

  const dispatch = useDispatch();
  useEffect(() => {
    try {
      if (user.displayName !== undefined && user.googleId !== undefined && user.role === 'khách hàng') {
        registerUser(user);
        setTimeout(() => {
          onClose();
          // enqueueSnackbar('Đăng nhập thành công!');
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

  const facebook = () => {};

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ marginBottom: 2, textAlign: 'center', fontSize: '23px !important' }} fontSize={36}>
        Chào mừng bạn đến với Shop Shoes!
      </DialogTitle>
      <DialogContent>
        <div className="w-3/4 my-0 mx-auto">
          <div className="text-center flex items-center flex-col">
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
              onClick={loginFacebook}
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
            <span> Hoặc</span>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              onClick={() => setOpenFormPhone(!openFormPhone)}
              sx={{
                backgroundColor: '#fff',
                justifyContent: 'space-between',
                color: '#000000',
                '&:hover': {
                  opacity: '0.9',
                },
                margin: '10px 0',
                fontSize: '14px',
                border: '1px solid rgb(20, 53, 195)',
                fontWeight: '400',
              }}
            >
              <img
                src="/logo/logo_social_phone.svg"
                alt="google"
                width="22"
                height="22"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(44%) sepia(76%) saturate(2915%) hue-rotate(325deg) brightness(97%) contrast(94%)',
                }}
              />
              <div className="normal-case">Tiếp tục với số điện thoại</div>
              <div className="opacity-0">T</div>
            </Button>

            {openFormPhone && !expandForm && (
              <>
                <div className="mb-5 text-sm">Sử dụng số điện thoại để Đăng nhập hoặc Đăng ký tài khoản của bạn</div>
                {/* <TextField
                      fullWidth
                      autoComplete="code"
                      label="Số điện thoại"
                      value={phoneNumber}
                      onChange={handleChangePhone}
                    />{' '} */}
                <Box className="flex flex-col justify-center items-center">
                  <TextField
                    label="Nhập số điện thoại"
                    fullWidth
                    value={phoneNumber}
                    onChange={handleChangePhone}
                    sx={{ m: 1 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">+84</InputAdornment>,
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={handleSendOTP}
                    sx={{
                      marginTop: '8px',
                      backgroundColor: 'rgb(20, 53, 195)',
                      '&:hover': { backgroundColor: 'rgb(18, 48, 176)' },
                      width: '20%',
                    }}
                    endIcon={<SendIcon />}
                  >
                    Gửi
                  </Button>
                </Box>
                {activeError && <span className="text-red-500 block mt-3">{activeError}</span>}
                {/* {phoneNumber.length === 0&& (
                      <span className="text-red-500 block mt-3">Vui lòng nhập đúng định dạng số điện thoại</span>
                    )} */}
              </>
            )}
            {openFormPhone && expandForm && (
              <>
                <div className="mb-5 text-sm">
                  Vui lòng nhập số OTP đã được gửi về số điện thoại {phoneNumber} để thực hiện đăng nhập
                </div>
                <OtpInput
                  value={OTP}
                  onChange={setOTP}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container "
                  inputStyles={{
                    width: '42.5px',
                    height: '42.5px',
                    margin: '0 14px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                />
                <ResendOTP renderButton={renderButton} renderTime={renderTime} maxTime={30} />
                {errorLoginOTP ? <span className="text-red-600">OTP không đúng</span> : ''}
                <div className="text-red-600 mt-2">Đã gửi OTP</div>
              </>
            )}
            <Box id="recaptcha" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
