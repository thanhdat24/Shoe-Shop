import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Checkbox,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  DialogContent,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useSnackbar } from 'notistack';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { DialogAnimate } from '../../../../components/animate';
import { getUsers, resetAdmin, updateAdmin } from '../../../../redux/slices/admin';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { error, adminUpdate } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { name, displayName, email, role, gender, active, avatar, status, _id } = row;
  console.log('active', active);
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
    dispatch(updateAdmin({ active: checked }, _id));
    handleCloseMenu();
  };
  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar('Cập nhật không thành công!', { variant: 'error' });
    } else if (adminUpdate) {
      console.log('234', adminUpdate);
      enqueueSnackbar('Cập nhật  thành công!');
      dispatch(getUsers());
      // navigate(PATH_DASHBOARD.user.list);
    }
    setTimeout(() => {
      dispatch(resetAdmin());
    }, 3000);
  }, [error, adminUpdate]);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  console.log('checked', checked);

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={avatar} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {displayName}
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
