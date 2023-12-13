import PropTypes from 'prop-types';
import sumBy from 'lodash/sumBy';
// @mui
import { styled } from '@mui/material/styles';
import { Grid, Rating, Button, Typography, LinearProgress, Stack, Link } from '@mui/material';
// utils
import { fShortenNumber } from '../utils/formatNumber';
// components
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------

const RatingStyle = styled(Rating)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const GridStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:nth-of-type(2)': {
    [theme.breakpoints.up('md')]: {
      borderLeft: `solid 1px ${theme.palette.divider}`,
      borderRight: `solid 1px ${theme.palette.divider}`,
    },
  },
}));

// ----------------------------------------------------------------------

ProductDetailsReviewOverview.propTypes = {
  product: PropTypes.object,
};

export default function ProductDetailsReviewOverview({ product }) {
  const { totalRating, totalReview, ratings } = product;
  const total = sumBy(ratings, (star) => star.starCount);

  return (
    <Grid container>
      <GridStyle item xs={12} md={6}>
        <Typography variant="subtitle1" gutterBottom>
          Đánh giá trung bình
        </Typography>
        <Typography variant="h2" gutterBottom sx={{ color: 'error.main' }}>
          {totalRating || 0}/5
        </Typography>
        <RatingStyle readOnly value={totalRating} precision={0.1} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          ({totalReview || 0}
          &nbsp;nhận xét)
        </Typography>
      </GridStyle>

      <GridStyle item xs={12} md={6}>
        <Stack spacing={1.5} sx={{ width: 1 }}>
          {ratings
            .slice(0)
            .reverse()
            .map((rating, index) => (
              <ProgressItem key={index} star={rating} total={total} />
            ))}
        </Stack>
      </GridStyle>
    </Grid>
  );
}

// ----------------------------------------------------------------------

ProgressItem.propTypes = {
  star: PropTypes.object,
  total: PropTypes.number,
};

function ProgressItem({ star, total }) {
  const { starName, starCount, reviewCount } = star;
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Typography variant="subtitle2">{starName} Sao</Typography>
      <LinearProgress
        variant="determinate"
        value={(starCount / total) * 100}
        sx={{
          mx: 2,
          flexGrow: 1,
          bgcolor: 'divider',
        }}
      />
      <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 64, textAlign: 'right' }}>
        {reviewCount} nhận xét
      </Typography>
    </Stack>
  );
}
