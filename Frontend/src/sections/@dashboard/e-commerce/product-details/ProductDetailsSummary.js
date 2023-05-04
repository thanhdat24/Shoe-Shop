import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Link, Stack, Button, Rating, Divider, IconButton, Typography } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fShortenNumber, fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import SocialsButton from '../../../../components/SocialsButton';
import { ColorSinglePicker } from '../../../../components/color-utils';
import { FormProvider, RHFSelect } from '../../../../components/hook-form';
import { useSelector } from '../../../../redux/store';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up(1368)]: {
    padding: theme.spacing(5, 8),
  },
}));

// ----------------------------------------------------------------------

ProductDetailsSummary.propTypes = {
  cart: PropTypes.array,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  product: PropTypes.shape({
    available: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.object),
    cover: PropTypes.string,
    id: PropTypes.string,
    inventoryType: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    priceSale: PropTypes.number,
    sizes: PropTypes.arrayOf(PropTypes.object),
    status: PropTypes.string,
  }),
};

export default function ProductDetailsSummary({ cart, product, ratingList, onAddCart, onGotoStep, ...other }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [detailColorSize, setDetailColorSize] = useState({});

  console.log('detailColorSize', detailColorSize);
  const { id, name, sizes, price, cover, status, colors, priceSale, inventoryType } = product;
  const { totalRating, totalReview } = ratingList;
  const alreadyProduct = cart?.map((item) => item.id).includes(id);

  const defaultValues = {
    id,
    name,
    cover: product.images[0],
    price,
    color: colors[0]?.color,

    size: sizes[0].size,
    quantity: detailColorSize.quantity < 1 ? 0 : 1,
  };
  const methods = useForm({
    defaultValues,
  });

  const { watch, control, setValue, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    const idColorAndSize = product.productDetail.filter(
      (item) => item.idColor.color === values.color && item.idSize.name === Number(values.size)
    );
    setDetailColorSize(idColorAndSize[0]);
  }, [values.color, values.size]);
  const onSubmit = async (data) => {
    try {
      if (!alreadyProduct) {
        onAddCart({
          ...data,
          subtotal: data.price * data.quantity,
          available: detailColorSize.quantity,
          idColor: detailColorSize.idColor._id,
              colorName: detailColorSize.idColor.name,
          idSize: detailColorSize.idSize._id,
          productId: detailColorSize.idProduct._id,
        });
      }
      onGotoStep(0);
      navigate('/checkout');
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCart = async () => {
    try {
      onAddCart({
        ...values,
        subtotal: values.price * values.quantity,
        available: detailColorSize.quantity,
        idColor: detailColorSize.idColor._id,
        colorName: detailColorSize.idColor.name,
        idSize: detailColorSize.idSize._id,
        productId: detailColorSize.idProduct._id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RootStyle {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={inventoryType === 'còn hàng' ? 'success' : 'error'}
          sx={{ textTransform: 'uppercase' }}
        >
          {inventoryType || ''}
        </Label>

        <Typography
          variant="overline"
          sx={{
            mt: 2,
            mb: 1,
            display: 'block',
            color: status === 'sale' ? 'error.main' : 'info.main',
          }}
        >
          {status}
        </Typography>

        <Typography variant="h5" paragraph>
          {name}
        </Typography>

        {ratingList && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Rating readOnly value={totalRating} precision={0.1} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ({fShortenNumber(totalReview)}
              &nbsp;nhận xét)
            </Typography>
          </Stack>
        )}

        <Typography variant="h4" sx={{ mb: 3 }}>
          <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
            {priceSale && fCurrency(priceSale)}
          </Box>
          &nbsp;{fCurrency(price)}
        </Typography>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Màu
          </Typography>

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorSinglePicker
                colors={colors}
                value={field.value}
                onChange={field.onChange}
                sx={{
                  ...(colors.length > 4 && {
                    maxWidth: 144,
                    justifyContent: 'flex-end',
                  }),
                }}
              />
            )}
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Kích cỡ
          </Typography>

          <RHFSelect
            name="size"
            size="small"
            fullWidth={false}
            FormHelperTextProps={{
              sx: { textAlign: 'right', margin: 0, mt: 1 },
            }}
            helperText={
              <Link underline="always" color="text.secondary">
                Size Chart
              </Link>
            }
          >
            {sizes.map((size) => (
              <option key={size.size} value={size.size}>
                {size.size}
              </option>
            ))}
          </RHFSelect>
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            Số lượng
          </Typography>

          <div>
            <Incrementer
              name="quantity"
              quantity={values.quantity}
              available={detailColorSize.quantity}
              onIncrementQuantity={() => setValue('quantity', values.quantity + 1)}
              onDecrementQuantity={() => setValue('quantity', values.quantity - 1)}
            />
            <Typography variant="caption" component="div" sx={{ mt: 1, textAlign: 'right', color: 'text.secondary' }}>
              Có sẵn: {detailColorSize ? detailColorSize.quantity : 0}
            </Typography>
          </div>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" spacing={2} sx={{ mt: 5 }}>
          <Button
            fullWidth
            disabled={detailColorSize.quantity === 0 && true}
            size="large"
            color="warning"
            variant="contained"
            startIcon={<Iconify icon={'ic:round-add-shopping-cart'} />}
            onClick={handleAddCart}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Thêm giỏ hàng
          </Button>

          <Button
            disabled={detailColorSize.quantity === 0 && true}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Mua ngay
          </Button>
        </Stack>

        <Stack alignItems="center" sx={{ mt: 3 }}>
          <SocialsButton initialColor />
        </Stack>
      </FormProvider>
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

Incrementer.propTypes = {
  available: PropTypes.number,
  quantity: PropTypes.number,
  onIncrementQuantity: PropTypes.func,
  onDecrementQuantity: PropTypes.func,
};

function Incrementer({ available, quantity, onIncrementQuantity, onDecrementQuantity }) {
  return (
    <Box
      sx={{
        py: 0.5,
        px: 0.75,
        border: 1,
        lineHeight: 0,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        borderColor: 'grey.50032',
      }}
    >
      <IconButton size="small" color="inherit" disabled={quantity <= 1} onClick={onDecrementQuantity}>
        <Iconify icon={'eva:minus-fill'} width={14} height={14} />
      </IconButton>

      <Typography variant="body2" component="span" sx={{ width: 40, textAlign: 'center' }}>
        {quantity}
      </Typography>

      <IconButton size="small" color="inherit" disabled={quantity >= available} onClick={onIncrementQuantity}>
        <Iconify icon={'eva:plus-fill'} width={14} height={14} />
      </IconButton>
    </Box>
  );
}
