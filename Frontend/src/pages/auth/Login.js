import { capitalCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Alert, Tooltip, Container, Typography } from '@mui/material';
// routes
import { PATH_AUTH } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';
// sections
import { LoginForm } from '../../sections/auth/login';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuth();

  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <div className="bg-[#CFD2E1] bg-login-pattern bg-cover">
      <div className="container flex flex-row items-center max-w-screen-lg md:px-10 mx-auto z-10 justify-center min-h-screen">
        <div className="bg-[#eff2f7] grid   select-none ">
          <div className="grid grid-cols-2 ">
            <div className=" text-center items-center flex justify-center">
              <img
                // src="https://nentang.vn/app/images/pages/login.png"
                src="/logo/Bluewass.png"
                alt="login"
              />
            </div>
            <div className="bg-[#10163a] text-[#c2c6dc] text-base">
              <div className="flex flex-col px-10 py-5 ">
                <h3 className="text-xl font-normal flex items-center justify-content py-2 text-[#c2c6dc]">Đăng nhập</h3>
                <span className="mb-7">Chào mừng bạn đến với Bluewass, vui lòng Đăng nhập!</span>
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
