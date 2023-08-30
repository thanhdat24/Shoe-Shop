import React, { useEffect } from 'react';
import { Container, Grid, Card, Button, Box, Menu, MenuItem, Tabs, Tab } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled, alpha } from '@mui/material/styles';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { getSuppliers, resetSupplier, updateSupplier } from '../../../../redux/slices/supplier';
import { useDispatch, useSelector } from '../../../../redux/store';
import { formatPriceInVND } from '../../../../utils/formatNumber';
import Label from '../../../../components/Label';
import { getReceipts } from '../../../../redux/slices/receipt';
import SuppliersHistoryList from './SuppliersHistoryList';
import useTabs from '../../../../hooks/useTabs';
import SuppliersDebtList from './SuppliersDebtList';
import Iconify from '../../../../components/Iconify';
import useToggle from '../../../../hooks/useToggle';
import ConfirmImport from '../InventoryReceives/ConfirmImport';
import SupplierEditDialog from './SupplierEditDialog';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      transitionDuration: '0.2s',
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
      '&:hover': {
        backgroundColor: '#00AB55',
        color: '#fff',
      },
    },
  },
}));

export default function SuppliersEdit() {
  const { supplierList } = useSelector((state) => state.supplier);
  const { receiptList } = useSelector((state) => state.receipt);
  const { supplierId = '' } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSuppliers());
    dispatch(getReceipts());
  }, [dispatch]);
  const { enqueueSnackbar } = useSnackbar();

  const supplier = supplierList?.find((item) => item.id === supplierId);
  console.log('supplier', supplier);
  console.log('receiptList', receiptList);
  const supplierAll = receiptList?.filter((item) => item.supplier.id === supplierId);
  console.log('supplierAll', supplierAll);
  const { updateSupplierSuccess } = useSelector((state) => state.supplier);
  const { currentTab, onChangeTab } = useTabs('Lịch sử nhập');
  console.log('updateSupplierSuccess', updateSupplierSuccess);
  const TABS = [
    {
      value: 'Lịch sử nhập',
      component: <SuppliersHistoryList supplierAll={supplierAll} />,
    },
    {
      value: 'Nợ phải trả',
      component: <SuppliersDebtList supplier={supplier} />,
    },
  ];
  const { toggle: open, onOpen, onClose } = useToggle();

  const [openEditSupplier, setOpenEditSupplier] = React.useState(false);

  const handleClickOpenEditSupplier = () => {
    setOpenEditSupplier(true);
  };

  const handleCloseEditSupplier = () => {
    setOpenEditSupplier(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStopSupplier = () => {
    dispatch(updateSupplier({ active: !supplier.active }, supplierId));
    setAnchorEl(null);
  };

  useEffect(() => {
    if (updateSupplierSuccess && supplier.active && open) {
      enqueueSnackbar('Tạm ngưng nhà cung cấp thành công', { variant: 'success' });
    } else if (updateSupplierSuccess && !supplier.active && open) {
      enqueueSnackbar('Kích hoạt nhà cung cấp thành công', { variant: 'success' });
    }

    if (updateSupplierSuccess && openEditSupplier) {
      enqueueSnackbar('Cập nhật thành công', { variant: 'success' });
    }
    dispatch(getSuppliers());
    handleCloseEditSupplier();
    onClose();
    return () => {
      dispatch(resetSupplier());
    };
  }, [updateSupplierSuccess]);

  return (
    <Container sx={{ paddingRight: '0px !important', paddingLeft: '0px !important' }}>
      <Box className="text-end flex justify-end mb-3">
        <Button
          id="demo-customized-button"
          aria-controls={openMenu ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? 'true' : undefined}
          variant="contained"
          disableElevation
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          size="small"
          color="primary"
          sx={{ padding: '8px 20px !important' }}
        >
          Thao tác
        </Button>

        <Box>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              'aria-labelledby': 'demo-customized-button',
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
          >
            <MenuItem onClick={() => onOpen()} disableRipple sx={{ color: 'red' }}>
              {supplier?.active ? ' Tạm ngưng nhà cung cấp' : 'Kích hoạt nhà cung cấp'}
            </MenuItem>
          </StyledMenu>
        </Box>
      </Box>
      <Grid container direction="row" justifyContent="center">
        <Grid container xs={8} sx={{ marginBottom: '30px', paddingRight: '12px' }}>
          <Box className="w-full mb-5">
            <Card
              sx={{
                borderRadius: ' 3px !important',
                zIndex: 0,
                padding: '24px',
                height: '100%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <Box className="mb-4 flex items-center">
                <Box className="text-lg capitalize leading-3 font-bold">{supplier?.name}</Box>
                <Box className="ml-3">
                  <Label variant="ghost" color={supplier?.active ? 'success' : 'default'}>
                    {supplier?.active ? 'Đang hoạt động' : 'Tạm ngừng'}
                  </Label>
                </Box>
              </Box>
              <Box className="pt-3 flex justify-around mb-4">
                <Box className="flex flex-col items-center">
                  <Box className="text-sm font-normal leading-5 text-[#595959] mt-1">Nợ phải trả</Box>
                  <Box className="text-lg font-bold leading-6 mt-2">{formatPriceInVND(supplier?.totalDebt)}</Box>
                </Box>
                <Box className="flex flex-col items-center">
                  <Box className="text-sm font-normal leading-5 text-[#595959] mt-1">Tổng mua</Box>
                  <Box className="text-lg font-bold leading-6 mt-2">{formatPriceInVND(supplier?.totalCost)}</Box>
                </Box>
              </Box>
              <hr />
            </Card>
          </Box>

          <Box className="w-full">
            <Card
              sx={{
                borderRadius: ' 3px !important',
                zIndex: 0,
                height: '100%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <Box className="p-4 !pb-0">
                <Tabs
                  allowScrollButtonsMobile
                  variant="scrollable"
                  scrollButtons="auto"
                  value={currentTab}
                  onChange={onChangeTab}
                >
                  {TABS.map((tab) => (
                    <Tab
                      disableRipple
                      key={tab.value}
                      label={tab.value}
                      value={tab.value}
                      sx={{ textTransform: 'initial' }}
                    />
                  ))}
                </Tabs>
              </Box>
              <Box sx={{ mb: 3 }} />

              {TABS.map((tab) => {
                const isMatched = tab.value === currentTab;
                return isMatched && <Box key={tab.value}>{tab.component}</Box>;
              })}
              <hr />
            </Card>
          </Box>
        </Grid>
        <Grid item xs={4} sx={{ paddingTop: '0px !important', marginBottom: '30px', paddingLeft: '12px' }}>
          <Box className="w-full">
            <Card
              sx={{
                borderRadius: ' 3px !important',
                zIndex: 0,
                padding: '24px',
                height: '100%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <Box className="">
                <Box className="flex justify-between">
                  <Box className="mb-4 font-semibold  ">Thông Tin Liên Hệ</Box>
                  <Box>
                    <Iconify
                      onClick={handleClickOpenEditSupplier}
                      icon={'eva:edit-fill'}
                      sx={{ width: 23, height: 23, cursor: 'pointer' }}
                    />
                  </Box>
                </Box>
                <hr />
                <Box className="mt-4 mb-4">
                  {!supplier?.contactName && !supplier?.contactEmail && !supplier?.contactPhone && <p>—</p>}
                  <p className="mt-3">{supplier?.contactName}</p>
                  <p className="mt-3 text-blue-500 hover:text-black">{supplier?.contactEmail}</p>
                  <p className="mt-3  text-blue-500 hover:text-black">{supplier?.contactPhone}</p>
                </Box>
                <hr />
                <Box className="mb-4 font-semibold mt-4 ">Địa chỉ</Box>
                <Box className="mt-4">
                  <p>{supplier?.fullAddress}</p>
                </Box>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Grid>

      <ConfirmImport
        title={supplier?.active ? 'Tạm ngưng nhà cung cấp' : 'Kích hoạt nhà cung cấp'}
        content={
          <div>
            {supplier?.active ? (
              <>
                Bạn có chắc chắn muốn tạm ngừng hoạt động của nhà cung cấp <b>{supplier?.name}</b> ? Bạn sẽ không thể
                mua hàng từ nhà cung cấp này nữa, thông tin lịch sử nhập/trả hàng và công nợ vẫn được giữ lại.
              </>
            ) : (
              <>
                Bạn có chắc chắn muốn kích hoạt nhà cung cấp <b>{supplier?.name}</b>
              </>
            )}
          </div>
        }
        open={open}
        maxWidth="sm"
        onClose={() => onClose()}
        onSave={() => handleStopSupplier()}
      />

      <SupplierEditDialog
        open={openEditSupplier}
        onClose={handleCloseEditSupplier}
        supplierDetail={supplier}
        supplierId={supplierId}
      />
    </Container>
  );
}
