import PropTypes from 'prop-types';
// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Radio,
  Stack,
  Button,
  Collapse,
  TextField,
  Typography,
  RadioGroup,
  CardHeader,
  CardContent,
  FormHelperText,
  FormControlLabel,
} from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// components
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { createPaymentMethod } from '../../../../redux/slices/product';
import { useDispatch } from '../../../../redux/store';

// ----------------------------------------------------------------------

const OptionStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2.5),
  justifyContent: 'space-between',
  transition: theme.transitions.create('all'),
  border: `solid 1px ${theme.palette.divider}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
}));

// ----------------------------------------------------------------------

CheckoutPaymentMethods.propTypes = {
  paymentOptions: PropTypes.array,
};

export default function CheckoutPaymentMethods({ paymentOptions }) {
  const { control } = useFormContext();

  const dispatch = useDispatch();

  const isDesktop = useResponsive('up', 'sm');

  return (
    <Card sx={{ my: 3 }}>
      <CardHeader title="Phương thức thanh toán" />
      <CardContent>
        <Controller
          name="payment"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <>
              <RadioGroup row {...field}>
                <Stack spacing={2}>
                  {paymentOptions?.map((method) => {
                    const { _id, name, icon, desc } = method;

                    const selected = field.value === name;
                    if (selected && name) {
                      dispatch(createPaymentMethod(name));
                    }

                    return (
                      <OptionStyle
                        key={_id}
                        sx={{
                          ...(selected && {
                            boxShadow: (theme) => theme.customShadows.z20,
                          }),
                        }}
                      >
                        <FormControlLabel
                          value={name}
                          control={<Radio checkedIcon={<Iconify icon={'eva:checkmark-circle-2-fill'} />} />}
                          label={
                            <Box sx={{ ml: 1 }}>
                              <Typography variant="subtitle2">{name}</Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {desc}
                              </Typography>
                            </Box>
                          }
                          sx={{ flexGrow: 1, py: 3 }}
                        />

                        {isDesktop && (
                          <Stack direction="row" spacing={1} flexShrink={0}>
                            <Image key={icon} alt="logo card" src={icon} sx={{ width: '30px', height: '30px' }} />
                          </Stack>
                        )}
                      </OptionStyle>
                    );
                  })}
                </Stack>
              </RadioGroup>

              {!!error && (
                <FormHelperText error sx={{ pt: 1, px: 2 }}>
                  {error.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </CardContent>
    </Card>
  );
}
