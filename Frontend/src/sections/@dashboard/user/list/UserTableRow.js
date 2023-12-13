import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {
  Avatar,
  Checkbox,
  DialogContent,
  FormControlLabel,
  MenuItem,
  Switch,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
// components
import { DialogAnimate } from '../../../../components/animate';
import Iconify from '../../../../components/Iconify';
import Label from '../../../../components/Label';
import { TableMoreMenu } from '../../../../components/table';
import { getUsers, resetAdmin, updateAdmin } from '../../../../redux/slices/admin';
import { resetUser, updateUser } from '../../../../redux/slices/user';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { error, updateSuccess } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { name, displayName, email, role, gender, active, photoURL, _id, phoneNumber } = row;
  const [openMenu, setOpenMenuActions] = useState(null);
  const [checked, setChecked] = useState(active);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };
  const handleUpdate = () => {
    setOpen(false);
    dispatch(updateUser({ active: checked }, _id));
    handleCloseMenu();
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={photoURL} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {displayName || phoneNumber}
        </Typography>
      </TableCell>

      <TableCell align="left">{email}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {role}
      </TableCell>
      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {gender}
      </TableCell>
      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          // color={active ? 'success' : 'error'}
          color={(active === false && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {active ? 'Active' : 'Banned'}
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
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Xóa
              </MenuItem>
              <MenuItem onClick={handleOpen}>
                <Iconify icon={'eva:edit-fill'} />
                Chỉnh sửa
              </MenuItem>
            </>
          }
        />
      </TableCell>
      <DialogAnimate
        open={open}
        onClose={handleClose}
        title={'Cập nhật người dùng'}
        onClickSubmit={handleUpdate}
        isEdit={'Cập nhật'}
      >
        <DialogContent sx={{ margin: 0, padding: 0, textAlign: 'center', fontSize: '25px' }}>
          {' '}
          <FormControlLabel
            sx={{ fontSize: '25px' }}
            control={<Switch checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />}
            label={<p style={{ fontSize: '18px' }}>Trạng thái</p>}
            labelPlacement="start"
          />
        </DialogContent>
      </DialogAnimate>
    </TableRow>
  );
}
