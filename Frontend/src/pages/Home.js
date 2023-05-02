// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
// sections
import { HomeHero, HomeMinimal, HomeAdvertisement, HomeHugePackElements } from '../sections/home';
import BestSeller from './BestSeller';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <Page title="Shoes">
      <RootStyle>
        <HomeHero />
        <ContentStyle>
          <HomeMinimal />
          <BestSeller />
          <HomeAdvertisement />
        </ContentStyle>
      </RootStyle>
    </Page>
  );
}
