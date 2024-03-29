import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
// @mui
import moment from 'moment';
import { useTheme } from '@mui/material/styles';

import {
  Avatar,
  Checkbox,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  Button,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  Link,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { InfoIcon } from '../../../../theme/overrides/CustomIcons';
import { updatePromotion } from '../../../../redux/slices/promotion';

import { useStyles } from './promotionStyle';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { fCurrency } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

PromotionTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function PromotionTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { promotions, isLoading } = useSelector((state) => state.promotion);
  const theme = useTheme();
  const classes = useStyles();

  const navigate = useNavigate();
  const { title, price, miniPrice, code, activeCode, startDate, expiryDate, id } = row;
  const [openMenu, setOpenMenuActions] = useState(null);
  const [openNotify, setOpenNotify] = useState(false);
  const dispatch = useDispatch();
  const handleClickButtonEnd = () => {
    setOpenNotify(true);
  };

  const handleCloseNotify = () => {
    setOpenNotify(false);
  };
  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const handleActiveCode = () => {
    let discountChangeActiveCode = promotions.find((item) => item._id === id);
    if (discountChangeActiveCode) {
      discountChangeActiveCode = { ...discountChangeActiveCode, activeCode: 'Kết thúc' };
    }

    dispatch(updatePromotion(discountChangeActiveCode, id));

    setOpenNotify(false);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell align="left">
        <Typography noWrap>
          <p> {title}</p>
          <Link
            component={RouterLink}
            to={PATH_DASHBOARD.promotion.edit(`${id}`)}
            color="info.main"
            sx={{
              textDecoration: 'underline',
              '&:hover': { color: '#40a9ff' },
            }}
          >
            {code}
          </Link>
          {/* <p> {code}</p> */}
        </Typography>
      </TableCell>
      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        Giảm {fCurrency(price)} ₫
      </TableCell>
      <TableCell align="left">
        <p>Tất cả sản phẩm</p>
        <p>Cho tất cả đơn hàng</p>
        <p> &gt;= {fCurrency(miniPrice)} ₫ giá trị đơn hàng</p>
      </TableCell>
      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        <p>
          <b className="mr-2">Từ:</b> <span> {moment(startDate)?.format('DD/MM/YYYY-hh:mm a')}</span>
        </p>
        <p>
          <b className="mr-2">Đến:</b> <span> {moment(expiryDate)?.format('DD/MM/YYYY-hh:mm a')}</span>
        </p>
      </TableCell>
      {/* <TableCell align="center">
        <Iconify
          icon={isVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
          sx={{
            width: 20,
            height: 20,
            color: 'success.main',
            ...(!isVerified && { color: 'warning.main' }),
          }}
        />
      </TableCell> */}

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          // color={active ? 'success' : 'error'}
          color={(activeCode === 'Kết thúc' && 'error') || (activeCode === 'Đang diễn ra' && 'success') || 'warning'}
          sx={{ textTransform: 'capitalize' }}
        >
          {activeCode}
        </Label>
      </TableCell>
      {activeCode !== 'Kết thúc' ? (
        <TableCell align="center">
          <Button
            variant="outlined"
            sx={{ marginBottom: 2 }}
            onClick={() => {
              onEditRow();
              handleCloseMenu();
            }}
          >
            Chỉnh sửa
          </Button>
          <Button variant="outlined" color="error" onClick={handleClickButtonEnd}>
            Kết thúc
          </Button>
        </TableCell>
      ) : (
        <TableCell align="center">{''}</TableCell>
      )}

      <Dialog open={openNotify} onClose={handleCloseNotify}>
        <DialogContent sx={{ width: 350, textAlign: 'center' }}>
          <DialogContentText sx={{ fontSize: 16, fontWeight: 'bold' }}>
            <InfoIcon sx={{ fontSize: 28, color: '#faad14' }} />{' '}
            <span> Bạn có thực sự muốn kết thúc chương trình này?</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              color: 'gray',
              borderColor: 'gray ',
              '&:hover': { color: 'primary.main' },
            }}
            size="medium"
            variant="outlined"
            className={classes.ButtonNotify}
            onClick={handleCloseNotify}
          >
            Huỷ
          </Button>
          <LoadingButton
            className={classes.ButtonNotify}
            size="medium"
            variant="contained"
            onClick={handleActiveCode}
            loading={isLoading}
          >
            Kết thúc
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}
