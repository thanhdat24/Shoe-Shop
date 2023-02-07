import PropTypes from 'prop-types';
import { useState } from 'react';
import moment from 'moment';
// @mui
import Slider from 'react-slick';
import { useTheme, alpha, styled } from '@mui/material/styles';

import { Checkbox, TableRow, TableCell, Typography, Stack, Link, MenuItem, Rating, Button, Box } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import createAvatar from '../../../../utils/createAvatar';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import Image from '../../../../components/Image';

// ----------------------------------------------------------------------

RatingTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  setIdShipper: PropTypes.func,
};

export default function RatingTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  setIdShipper,
}) {
  const theme = useTheme();
  // const { allRating } = useSelector((state) => state.rating);
  console.log('row', row);
  const { idProduct, imageRating, idOrder, content, rating, createdAt, active, _id } = row;
  const handleChangeStatus = (id) => {
    console.log('id', id);
  };

  const RootStyle = styled('div')(({ theme }) => ({
    '& .slick-slide': {
      float: theme.direction === 'rtl' ? 'right' : 'left',
      '&:focus': { outline: 'none' },
    },
  }));

  const settings2 = {
    dots: false,
    arrows: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: true,
    centerPadding: '0px',
    slidesToShow: imageRating.length > 3 ? 3 : imageRating.length,
  };
  // setIdShipper === _id;
  // setIdShipper(_id);
  const THUMB_SIZE = 64;
  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected} sx={{ margin: '0 10px' }}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell align="left">{idProduct.name}</TableCell>
      <TableCell align="left">
        {/* <RootStyle>
          <Box
            sx={{
              my: 3,
              '& .slick-current .isActive': { opacity: 1 },
              ...(imageRating.length === 1 && { maxWidth: THUMB_SIZE * 1 + 16 }),
              ...(imageRating.length === 2 && { maxWidth: THUMB_SIZE * 2 + 32 }),
              ...(imageRating.length === 3 && { maxWidth: THUMB_SIZE * 3 + 48 }),
              ...(imageRating.length === 4 && { maxWidth: THUMB_SIZE * 3 + 48 }),
              ...(imageRating.length >= 5 && { maxWidth: THUMB_SIZE * 6 }),
              ...(imageRating.length > 2 && {
                position: 'relative',
                '&:before, &:after': {
                  top: 0,
                  zIndex: 9,
                  content: "''",
                  height: '100%',
                  position: 'absolute',
                },
                '&:after': { right: 0, transform: 'scaleX(-1)' },
              }),
            }}
          >
            <Slider {...settings2}>
              {imageRating.map((img, index) => (
                <Box key={img} sx={{ px: 0.75 }}>
                  <Image
                    disabledEffect
                    alt="thumb image"
                    src={img}
                    sx={{
                      width: THUMB_SIZE,
                      height: THUMB_SIZE,
                      borderRadius: 1.5,
                      cursor: 'pointer',
                    }}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        </RootStyle> */}
        <div className="flex">
          {imageRating.map((image) => {
            return (
              <Box key={image} sx={{ px: 0.5 }}>
                <Image
                  disabledEffect
                  alt="thumb image"
                  src={image}
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                  }}
                />
              </Box>
            );

            // <img src={image} alt={image} width={50} height={30} style={{borderRadius:"10px", marginRight:"5px"}}/>;
          })}
        </div>
      </TableCell>
      <TableCell align="center">{idOrder.idUser.displayName}</TableCell>
      <TableCell align="left">{content}</TableCell>
      <TableCell align="center">
        {' '}
        <Rating readOnly value={rating} precision={0.1} />
      </TableCell>
      <TableCell align="center"> {moment(createdAt).format('DD-MM-YYYY')}</TableCell>
      <TableCell align="center">
        {' '}
        {active ? (
          <Button
            variant="outlined"
            color="success"
            onClick={() => {
              onViewRow();
            }}
          >
            Đã duyệt
          </Button>
        ) : (
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              onViewRow();
            }}
          >
            Chưa duyệt
          </Button>
        )}{' '}
      </TableCell>

      {/* <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          src={idUser?.photoURL}
          alt={idUser.displayName}
          sx={{ mr: 2 }}
          imgProps={{ referrerPolicy: 'no-referrer' }}
        />
      </TableCell>
      
      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {moment(createdAt).format('DD-MM-YYYY')}
      </TableCell>
      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === 'Đã nhận' && 'success') ||
            (status === 'Đã giao hàng' && 'info') ||
            (status === 'Đang vận chuyển' && 'warning') ||
            (status === 'Đã đánh giá' && 'primary') ||
            (status === 'Đang xử lý' && 'default') ||
            (status === 'Đã hủy' && 'error') ||
            'default'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {fCurrency(total)}₫
      </TableCell>
      <TableCell align="center">
        {' '}
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (paymentMethod.resultCode === 0 && 'success') || (paymentMethod.resultCode === 1000 && 'warning') || 'error'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {(paymentMethod.resultCode === 0 && 'Đã thanh toán') ||
            (paymentMethod.resultCode === 1000 && 'Chờ thanh toán') ||
            'Đã hủy'}
        </Label>
      </TableCell> */}
    </TableRow>
  );
}
