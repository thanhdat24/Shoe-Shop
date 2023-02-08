import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { paramCase } from 'change-case';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
// import { addCart } from '../../redux/slices/product';
import { SkeletonProductItem } from '../../../../components/skeleton';
import BestSellerCard from './BestSellerCard';
// import BestSellerCard from './BestSellerCard';
BestSellerList.prototype = {
  bestSellerProd: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export default function BestSellerList({ bestSellerProd, loading }) {
  const navigate = useNavigate();
  const handleSelected = async (product) => {
    navigate(`product/${paramCase(product.name)}`);
    console.log('productsfs ', product);
    // dispatch(addCart(product));
    // try {
    //   onAddCart({
    //     ...values,
    //     subtotal: values.price * values.quantity,
    //     available: detailColorSize.quantity,
    //     idColor: detailColorSize.idColor._id,
    //     idSize: detailColorSize.idSize._id,
    //     productId: detailColorSize.idProduct._id,
    //   });
    // } catch (error) {
    //   console.error(error);
    // }
  };
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(3, 1fr)',
        },
      }}
    >
      {(loading ? [...Array(6)] : bestSellerProd)?.map((product, index) =>
        product ? (
          <BestSellerCard onSelected={() => handleSelected(product)} index={index} product={product} />
        ) : (
          <SkeletonProductItem key={index} />
        )
      )}
    </Box>
  );
}
