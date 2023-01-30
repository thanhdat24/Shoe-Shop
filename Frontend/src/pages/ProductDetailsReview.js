import PropTypes from 'prop-types';
// @mui
import { Divider } from '@mui/material';
//
import ProductDetailsReviewList from './ProductDetailsReviewList';
import ProductDetailsReviewOverview from './ProductDetailsReviewOverview';

// ----------------------------------------------------------------------

ProductDetailsReview.propTypes = {
  product: PropTypes.object,
};

export default function ProductDetailsReview({ product }) {
  return (
    <>
      <ProductDetailsReviewOverview product={product} />

      <Divider />

      <ProductDetailsReviewList product={product.data} />
    </>
  );
}
