import { capitalCase } from 'change-case';
import { useState } from 'react';
import { m } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {
  Button,
  Box,
  Link,
  Container,
  Typography,
  Stack,
  Radio,
  Tooltip,
  RadioGroup,
  CardActionArea,
  FormControlLabel,
} from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_HOME } from '../../routes/paths';
// components
import Image from '../../components/Image';
import Iconify from '../../components/Iconify';
import TextIconLabel from '../../components/TextIconLabel';
import { MotionContainer, varFade } from '../../components/animate';
import useSettings from '../../hooks/useSettings';

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.grey[400],
  [theme.breakpoints.up('md')]: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100vh',
    display: 'flex',
    position: 'fixed',
    alignItems: 'center',
  },
}));

const ContentStyle = styled((props) => <Stack spacing={5} {...props} />)(({ theme }) => ({
  zIndex: 10,
  maxWidth: 520,
  margin: 'auto',
  textAlign: 'center',
  position: 'relative',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    margin: 'unset',
    textAlign: 'left',
  },
}));

// ----------------------------------------------------------------------

export default function HomeHero() {
  const [settings, setSettings] = useState('default');

  const onChangeColor = (event) => {
    setSettings(event.target.value);
  };
  const { themeColorPresets, colorSetting } = useSettings();
  return (
    <MotionContainer>
      <RootStyle>
        <Box sx={{ position: 'absolute', top: '-75px', right: '122px' }}>
          <m.div variants={varFade().inDown}>
            <m.div animate={{ y: [-25, 5, -25] }} transition={{ duration: 10, repeat: Infinity }}>
              <Image
                disabledEffect
                alt="sidebar"
                src={`/static/shoes-${settings}.png`}
                sx={{ transform: 'rotate(-22deg)' }}
              />
            </m.div>
          </m.div>
        </Box>

        <RadioGroup name="themeColorPresets" value={settings} onChange={onChangeColor} sx={{ my: 5 }}>
          <Stack
            direction={{ xs: 'row', lg: 'column' }}
            justifyContent="center"
            spacing={1}
            sx={{
              position: { lg: 'absolute' },
              right: { lg: '76px' },
              top: { lg: '45%' },
            }}
          >
            {colorSetting.map((color) => {
              const colorName = color.name;
              const colorValue = color.value;
              const isSelected = settings === colorName;

              return (
                <Tooltip key={colorName} title={capitalCase(colorName)} placement="right">
                  <CardActionArea sx={{ color: colorValue, borderRadius: '50%', width: 32, height: 32 }}>
                    <Box
                      sx={{
                        width: 1,
                        height: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        ...(isSelected && {
                          borderStyle: 'solid',
                          borderWidth: 4,
                          borderColor: alpha(colorValue, 0.24),
                        }),
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: colorValue,
                          ...(isSelected && {
                            width: 14,
                            height: 14,
                            transition: (theme) =>
                              theme.transitions.create('all', {
                                easing: theme.transitions.easing.easeInOut,
                                duration: theme.transitions.duration.shorter,
                              }),
                          }),
                        }}
                      />
                      <FormControlLabel
                        label=""
                        value={colorName}
                        control={<Radio sx={{ display: 'none' }} />}
                        sx={{
                          top: 0,
                          left: 0,
                          margin: 0,
                          width: 1,
                          height: 1,
                          position: 'absolute',
                        }}
                      />
                    </Box>
                  </CardActionArea>
                </Tooltip>
              );
            })}
          </Stack>
        </RadioGroup>

        <Container>
          <ContentStyle>
            <m.div variants={varFade().inRight}>
              <Typography variant="h1" sx={{ color: 'common.black', marginTop: 20 }}>
                Nike Blue Shoes <br />
                <Typography component="span" variant="h1" sx={{ color: 'primary.main' }}>
                  Nike Metcon Shoes
                </Typography>
              </Typography>
            </m.div>

            <Stack spacing={2.5} alignItems="center" direction={{ xs: 'column', md: 'row' }}>
              <m.div variants={varFade().inRight}>
                <TextIconLabel
                  icon={<Image alt="sketch icon" src="/static/logo-nike.svg" sx={{ width: 80, height: 80, mr: 1 }} />}
                />
              </m.div>

              <m.div variants={varFade().inRight}>
                <TextIconLabel
                  icon={<Image alt="sketch icon" src="/static/logo-adidas.svg" sx={{ width: 80, height: 80, mr: 1 }} />}
                />
              </m.div>
              <m.div variants={varFade().inRight}>
                <TextIconLabel
                  icon={<Image alt="sketch icon" src="/static/logo-reebok.svg" sx={{ width: 80, height: 80, mr: 1 }} />}
                />
              </m.div>
              <m.div variants={varFade().inRight}>
                <TextIconLabel
                  icon={<Image alt="sketch icon" src="/static/logo-puma.svg" sx={{ width: 80, height: 80, mr: 1 }} />}
                />
              </m.div>
            </Stack>

            <m.div variants={varFade().inRight}>
              <Button
                size="large"
                variant="contained"
                component={RouterLink}
                to={PATH_HOME.search.viewAll}
                startIcon={<Iconify icon={'eva:flash-fill'} width={20} height={20} />}
              >
                Mua ngay
              </Button>
            </m.div>
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: '100vh' } }} />
    </MotionContainer>
  );
}
