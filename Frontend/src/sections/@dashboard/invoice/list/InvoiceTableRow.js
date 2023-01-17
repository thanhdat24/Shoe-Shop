import PropTypes from 'prop-types';
import { useState } from 'react';
import moment from 'moment';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import createAvatar from '../../../../utils/createAvatar';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

InvoiceTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  setIdShipper: PropTypes.func,
};

export default function InvoiceTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
  setIdShipper,
}) {
  const theme = useTheme();

  const { address, _id, createdAt, status, total, paymentMethod, idUser, idShipper } = row;
  console.log('csdg', _id);
  console.log('row', row);

  // setIdShipper === _id;
  // setIdShipper(_id);

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={idUser?.photoURL} alt={idUser.displayName} sx={{ mr: 2 }} />
        <Stack>
          <Typography variant="subtitle2" noWrap>
            {address.fullName}
          </Typography>

          <Link noWrap variant="body2" onClick={onViewRow} sx={{ color: 'text.disabled', cursor: 'pointer' }}>
            {_id}
          </Link>
        </Stack>
        {/* <TableCell align="left">{_id}</TableCell> */}
      </TableCell>
      <TableCell align="center">{address.phoneNumber}</TableCell>
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
      {/* <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {status}
      </TableCell> */}
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
      </TableCell>
      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onViewRow();
                  handleCloseMenu();

                  //  setIdShipper(row?.idShipper._id);
                }}
              >
                <Iconify icon={'eva:eye-fill'} />
                Chi tiết
              </MenuItem>
            </>
          }
        />
      </TableCell>{' '}
    </TableRow>
  );
}
