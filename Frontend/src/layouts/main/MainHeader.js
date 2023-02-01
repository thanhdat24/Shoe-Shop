import { useState } from 'react';
import { paramCase } from 'change-case';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

// @mui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Container,
  Link,
  Autocomplete,
  InputAdornment,
  Typography,
  Popper,
} from '@mui/material';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
import useResponsive from '../../hooks/useResponsive';
// utils
import cssStyles from '../../utils/cssStyles';
// config
import { HEADER } from '../../config';
// components
import Logo from '../../components/Logo';
import Label from '../../components/Label';
//
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';
import navConfig from './MenuConfig';
import AccountPopover from '../dashboard/header/AccountPopover';
import useAuth from '../../hooks/useAuth';
import Avatar from '../../components/Avatar';
import CartWidget from '../../sections/@dashboard/e-commerce/CartWidget';
import { createBilling, onNextStep } from '../../redux/slices/product';
import { useDispatch } from '../../redux/store';
import LoginUserForm from '../../pages/auth/LoginUserForm';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
// utils
import axios from '../../utils/axios';
// routes
import { PATH_HOME } from '../../routes/paths';
// components
import SearchNotFound from '../../components/SearchNotFound';
import InputStyle from '../../components/InputStyle';
import Iconify from '../../components/Iconify';
import Image from '../../components/Image';
import { fCurrency } from '../../utils/formatNumber';

// ----------------------------------------------------------------------

const PopperStyle = styled((props) => <Popper placement="bottom-start" {...props} />)({
  width: '508px !important',
});

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: HEADER.MOBILE_HEIGHT,
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('md')]: {
    height: HEADER.MAIN_DESKTOP_HEIGHT,
  },
}));

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}));

// ----------------------------------------------------------------------

export default function MainHeader() {
  const dispatch = useDispatch();
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);

  const { user } = useAuth();
  console.log('user123', user);
  const theme = useTheme();

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'md');

  const isHome = pathname === '/';

  //
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleCreateBilling = (value) => {
    dispatch(createBilling(value));
  };

  const navigate = useNavigate();

  const isMountedRef = useIsMountedRef();

  const [searchQuery, setSearchQuery] = useState('');

  const [searchResults, setSearchResults] = useState([]);

  const handleChangeSearch = async (value) => {
    try {
      setSearchQuery(value);
      console.log('value', value);
      if (value) {
        const response = await axios.get('/api/v1/products/search', {
          params: { query: value },
        });
        console.log('response', response);
        if (isMountedRef.current) {
          setSearchResults(response.data.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = (name) => {
    navigate(PATH_HOME.search.view(paramCase(name)));
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      handleClick(searchQuery);
      console.log('searchQuery', searchQuery);
    }
  };
  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            ...cssStyles(theme).bgBlur(),
            height: { md: HEADER.MAIN_DESKTOP_HEIGHT - 16 },
          }),
        }}
      >
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Logo />
          {/* <Box sx={{ flexGrow: 2 }} /> */}
          <Label color="info" sx={{ ml: 1 }}>
            v3.3.0
          </Label>

          <Autocomplete
            size="small"
            // autoHighlight
            popupIcon={null}
            PopperComponent={PopperStyle}
            options={searchResults}
            onInputChange={(event, value) => handleChangeSearch(value)}
            getOptionLabel={(product) => product.name}
            noOptionsText={<SearchNotFound searchQuery={searchQuery} />}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <InputStyle
                {...params}
                name="search"
                stretchStart={450}
                placeholder="Bạn tìm gì hôm nay"
                onKeyUp={handleKeyUp}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={'eva:search-fill'} sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            renderOption={(props, product, { inputValue }) => {
              const { name, productImages, price } = product;
              const matches = match(name, inputValue);
              const parts = parse(name, matches);
              console.log('parts', parts);
              return (
                <Link underline="none" component={RouterLink} to={PATH_HOME.product.view(paramCase(name))}>
                  <li {...props}>
                    <Image
                      alt={productImages[0].url[0]}
                      src={productImages[0].url[0]}
                      sx={{ width: 48, height: 48, borderRadius: 1, flexShrink: 0, mr: 1.5 }}
                    />
                    <Box className="flex flex-col">
                      <Box>
                        {parts.map((part, index) => (
                          <Typography
                            key={index}
                            component="span"
                            variant="subtitle1"
                            color={part.highlight ? 'primary' : 'textPrimary'}
                          >
                            {part.text}
                          </Typography>
                        ))}
                      </Box>
                      <Typography component="div" variant="subtitle3" sx={{ color: 'rgba(254, 52, 100,1) !important' }}>
                        {fCurrency(price)}
                      </Typography>
                    </Box>
                  </li>
                </Link>
              );
            }}
          />

          {isDesktop && <MenuDesktop isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}
          {user.email !== undefined ? (
            <AccountPopover />
          ) : (
            <button onClick={handleClickOpen}>
              <Avatar src="" alt={user?.displayName} color={'default'}>
                {/* {createAvatar(user?.displayName).name} */}
              </Avatar>
            </button>
          )}
          <CartWidget />

          <LoginUserForm
            open={open}
            onClose={handleClose}
            onNextStep={handleNextStep}
            onCreateBilling={handleCreateBilling}
          />

          {!isDesktop && <MenuMobile isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
}
