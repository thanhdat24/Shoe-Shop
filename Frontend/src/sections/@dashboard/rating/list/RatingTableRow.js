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
  const { idProduct, imageRating, idOrder, content, rating, createdAt, active, _id } = row;
  const handleChangeStatus = (id) => {};

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
      <TableCell align="left">{idProduct.name}</TableCell>
      <TableCell align="left">
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
          <Button variant="outlined" color="success">
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
    </TableRow>
  );
}
