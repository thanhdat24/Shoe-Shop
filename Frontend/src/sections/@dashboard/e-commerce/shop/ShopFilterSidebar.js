import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
// form
import { Controller, useFormContext } from 'react-hook-form';
// @mui
import {
  Box,
  Divider,
  FormControl,
  InputBase,
  InputLabel,
  Slider as MuiSlider,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
// lodash;
// @types
// components
import { ColorManyPicker } from '../../../../components/color-utils';
import { RHFMultiCheckbox, RHFRadioGroupName } from '../../../../components/hook-form';
import Scrollbar from '../../../../components/Scrollbar';
import { PATH_HOME } from '../../../../routes/paths';

// ----------------------------------------------------------------------

export const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];

export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];

// ---------------------------------------------------

const MIN_AMOUNT = 1000000;
const MAX_AMOUNT = 10000000;
const STEP = 1000000;

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
    border: '1px solid #ced4da',
    fontSize: 13,
    fontWeight: 700,
    width: 'auto',
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join('.'),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const onSelected = (selected, item) =>
  selected.includes(item) ? selected.filter((value) => value !== item) : [...selected, item];

ShopFilterSidebar.propTypes = {
  isOpen: PropTypes.bool,
  onResetAll: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

export default function ShopFilterSidebar({
  onResetAll,
  FILTER_CATEGORY_OPTIONS,
  FILTER_COLOR_OPTIONS,
  FILTER_GENDER_OPTIONS,
}) {
  const { control } = useFormContext();
  const [value1, setValue1] = React.useState([1000000, 10000000]);
  const navigate = useNavigate();
  const valueText = (value) => {
    return `${value}`;
  };
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q') || 'tất cả sản phẩm';

  const searchGender = searchParams.get('gender');

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - MIN_AMOUNT), value1[1]]);
      if (search) {
        navigate(PATH_HOME.search.viewPrice(search, Math.min(newValue[0], value1[1] - MIN_AMOUNT), value1[1]));
      } else {
        navigate(
          PATH_HOME.search.viewPriceGender(searchGender, Math.min(newValue[0], value1[1] - MIN_AMOUNT), value1[1])
        );
      }
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + MIN_AMOUNT)]);
      if (search) {
        navigate(PATH_HOME.search.viewPrice(search, value1[0], Math.max(newValue[1], value1[0] + MIN_AMOUNT)));
      } else {
        navigate(
          PATH_HOME.search.viewPriceGender(searchGender, value1[0], Math.max(newValue[1], value1[0] + MIN_AMOUNT))
        );
      }
    }
  };

  const handleChangeMin = (e) => {
    setValue1([Number(e.target.value.substring(1)), value1[1]]);
  };

  const handleChangeMax = (e) => {
    setValue1([value1[0], Number(e.target.value.substring(1))]);
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
  });
  return (
    <>
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Bộ lọc
          </Typography>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle1">Khoảng giá</Typography>
              <Box sx={{ width: 'auto', padding: '10px 12px' }}>
                <MuiSlider
                  getAriaLabel={() => 'Minimum distance'}
                  value={value1}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  getAriaValueText={valueText}
                  disableSwap
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  marks
                  step={STEP}
                />

                <Box>
                  <Box
                    component="form"
                    noValidate
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { sm: '1fr 1fr' },
                      gap: 2,
                    }}
                  >
                    <FormControl variant="standard">
                      <InputLabel shrink htmlFor="bootstrap-input" sx={{ fontWeight: 'bold' }}>
                        Từ
                      </InputLabel>
                      <BootstrapInput
                        onChange={handleChangeMin}
                        defaultValue="0"
                        value={`${formatter.format(value1[0])}`}
                        id="bootstrap-input"
                      />
                    </FormControl>
                    <FormControl variant="standard">
                      <InputLabel shrink htmlFor="bootstrap-input" sx={{ fontWeight: 'bold' }}>
                        Đến
                      </InputLabel>
                      {/* {value1.split(",")} */}
                      <BootstrapInput
                        defaultValue="500.000"
                        onChange={handleChangeMax}
                        value={`${formatter.format(value1[1])}`}
                        id="bootstrap-input"
                      />
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1">Giới tính</Typography>
              <RHFMultiCheckbox
                name="gender"
                options={FILTER_GENDER_OPTIONS}
                getOptionLabel={(option) => option.name}
                sx={{ width: 1 }}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1">Loại sản phẩm</Typography>
              <RHFRadioGroupName name="category" options={FILTER_CATEGORY_OPTIONS} row={false} />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1">Màu sắc</Typography>

              <Controller
                name="colors"
                control={control}
                render={({ field }) => (
                  <ColorManyPicker
                    colors={FILTER_COLOR_OPTIONS}
                    onChangeColor={(color) => field.onChange(onSelected(field.value, color))}
                    sx={{ maxWidth: 36 * 4 }}
                  />
                )}
              />
            </Stack>

            {/* <Stack spacing={1}>
              <Typography variant="subtitle1">Price</Typography>
              <RHFRadioGroup
                name="priceRange"
                options={FILTER_PRICE_OPTIONS.map((item) => item.value)}
                getOptionLabel={FILTER_PRICE_OPTIONS.map((item) => item.label)}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle1">Rating</Typography>

              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    {FILTER_RATING_OPTIONS.map((item, index) => (
                      <FormControlLabel
                        key={item}
                        value={item}
                        control={
                          <Radio
                            disableRipple
                            color="default"
                            icon={<Rating readOnly value={4 - index} />}
                            checkedIcon={<Rating readOnly value={4 - index} />}
                            sx={{
                              '&:hover': { bgcolor: 'transparent' },
                            }}
                          />
                        }
                        label="& Up"
                        sx={{
                          my: 0.5,
                          borderRadius: 1,
                          '&:hover': { opacity: 0.48 },
                          ...(field.value.includes(item) && {
                            bgcolor: 'action.selected',
                          }),
                        }}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </Stack> */}
          </Stack>
        </Scrollbar>

        {/* <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            onClick={onResetAll}
            startIcon={<Iconify icon={'ic:round-clear-all'} />}
          >
            Clear All
          </Button>
        </Box> */}
      </Box>
    </>
  );
}
