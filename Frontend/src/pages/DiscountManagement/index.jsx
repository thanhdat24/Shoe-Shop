import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Breadcrumbs,
  Link,
  Box,
  Tooltip,
  Rating,
  Button,
  Chip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { filter } from "lodash";
import TicketListHead from "../../components/Ticket/TicketListHead";
import TicketListToolbar from "../../components/Ticket/TicketToolbar";

import ReviewMoreMenu from "../../components/Review/ReviewMoreMenu";
import { useSnackbar } from "notistack";
import { Link as RouterLink, useHistory } from "react-router-dom";
import plusFill from "@iconify/icons-eva/plus-fill";

import formatDate from "../../utils/formatDate";
import { getDiscountsList, resetDiscount } from "../../redux/actions/Discount";
import moment from "moment";
import { useStyles } from "./styles";
import ActionMoreMenu from "./ActionMoreMenu";
import FilterDiscount from "./FilterDiscount";

const TABLE_HEAD = [
  { id: "code", label: "Mã giảm giá", alignRight: false },
  { id: "price", label: "Loại giảm giá", alignRight: false },
  { id: "criteria", label: "Tiêu chí", alignRight: false },
  { id: "date", label: "Thời gian áp dụng", alignRight: false },
  // { id: "userCreate", label: "Người tạo", alignRight: false },
  { id: "activeCode", label: "Trạng thái", alignRight: false },
  { id: "action", label: "Thao tác", alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, queryCode, queryActive) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (queryCode) {
    return filter(array, (discount) => discount.code.indexOf(queryCode) !== -1);
  }
  if (queryActive !== "Tất cả") {
    return filter(array, (discount) => discount.activeCode === queryActive);
  }
  return stabilizedThis?.map((el) => el[0]);
}

function formatDateShow(date) {
  return moment(date).add(0, "hours").format("DD/MM/YYYY - hh:mm:ss");
}
export default function DiscountManagement() {
  const {
    discountList: { data: discountList },
    successUpdateDiscount,
    errorUpdateDiscount,
    successDeleteDiscount,
    errorDeleteDiscount,
  } = useSelector((state) => state.DiscountReducer);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { successCreateDiscount } = useSelector(
    (state) => state.DiscountReducer
  );
  const [page, setPage] = useState(0);
  const history = useHistory();
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [filterDiscount, setFilterDiscount] = useState("Tất cả");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();

  discountList?.sort(
    (a, b) => formatDate(b.createdAt).getTime - formatDate(a.createdAt).getTime
  );

  useEffect(() => {
    // get list user lần đầu
    if (!discountList) {
      dispatch(getDiscountsList());
    }
    return () => dispatch(resetDiscount());
  }, []);

  useEffect(() => {
    if (successDeleteDiscount) {
      enqueueSnackbar("Xoá mã giảm giá thành công!", { variant: "success" });
      dispatch(getDiscountsList());
    }
    if (errorDeleteDiscount) {
      enqueueSnackbar(errorDeleteDiscount, { variant: "error" });
    }
  }, [successDeleteDiscount, errorDeleteDiscount]);

  useEffect(() => {
    if (successCreateDiscount || successUpdateDiscount) {
      dispatch(getDiscountsList());
    }
  }, [successCreateDiscount, successUpdateDiscount]);

  useEffect(() => {
    if (successUpdateDiscount) {
      enqueueSnackbar("Lưu thành công!", { variant: "success" });
    }
    if (errorUpdateDiscount) {
      enqueueSnackbar(errorUpdateDiscount, { variant: "error" });
    }
  }, [successUpdateDiscount, errorUpdateDiscount]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleFilterByDiscount = (event) => {
    setFilterDiscount(event.target.value);
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - discountList?.length) : 0;

  const filteredMovies = applySortFilter(
    discountList,
    getComparator(order, orderBy),
    filterName,
    filterDiscount
  );

  const isUserNotFound = discountList?.length === 0;

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      href="/admin/dashboard"
      color="text.primary"
      sx={{ "&:hover": { color: "#212B36" } }}
    >
      Trang chủ
    </Link>,
    <Typography key="2" color="inherit">
      Mã giảm giá
    </Typography>,
  ];
  return (
    <>
      <Container
        sx={{ paddingRight: "0px !important", paddingLeft: "0px !important" }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
          mt={7.5}
        >
          <Stack spacing={2}>
            <Typography variant="h4" gutterBottom>
              Danh sách mã giảm giá
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Stack>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
            onClick={() => history.push("/admin/discount/create")}
            sx={{ "&:hover": { color: "#fff" }, textTransform: "none" }}
          >
            Tạo mã giảm giá
          </Button>
        </Stack>
        <Card>
          <FilterDiscount
            filterName={filterName}
            onFilterName={handleFilterByName}
            filterDiscount={filterDiscount}
            onFilterDiscount={handleFilterByDiscount}
          />
          <TableContainer
            sx={{ minWidth: 800, fontSize: "13px !important" }}
            className="text-xs"
          >
            <Table sx={{ fontSize: "13px !important" }} className="text-xs">
              <TicketListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={discountList?.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                // onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredMovies
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const {
                      _id,
                      title,
                      code,
                      price,
                      miniPrice,
                      startDate,
                      expiryDate,
                      activeCode,
                    } = row;
                    return (
                      <TableRow hover key={_id} tabIndex={-1} name="checkbox">
                        <TableCell align="left" width="15%">
                          <div className="grid">
                            <span>{title}</span>
                            <span className="mt-2">
                              {" "}
                              <strong>
                                <Link
                                  href="#"
                                  color="info.main"
                                  sx={{
                                    "&:hover": { color: "#40a9ff" },
                                  }}
                                >
                                  {code}
                                </Link>
                              </strong>
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="left" width="15%">
                          Giảm {(price * 1).toLocaleString("vi-VI")} đ
                        </TableCell>
                        <TableCell align="left" width="20%">
                          <div className="grid">
                            <span style={{ color: "#1682F8" }}>
                              Tất cả sản phẩm
                            </span>
                            <span>Cho tất cả khách hàng</span>
                            <span>
                              {" "}
                              {">"}={" "}
                              {`${(miniPrice * 1).toLocaleString("vi-VI")} đ`}{" "}
                              giá trị đơn hàng
                            </span>
                            <span>
                              Không giới hạn số lần sử dụng mỗi khách hàng
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="left" width="20%">
                          <span>
                            <span className="font-semibold mr-4"> Từ: </span>
                            {formatDateShow(startDate)}
                          </span>{" "}
                          <br />
                          <span>
                            <span className="font-semibold mr-4"> Đến: </span>
                            {formatDateShow(expiryDate)}
                          </span>
                        </TableCell>
                        <TableCell align="left">
                          {activeCode === "Sắp diễn ra" ? (
                            <Chip
                              label={activeCode}
                              variant="outlined"
                              className={classes.labelComingSoon}
                            />
                          ) : activeCode === "Đang diễn ra" ? (
                            <Chip
                              label={activeCode}
                              variant="outlined"
                              className={classes.labelNowShowing}
                            />
                          ) : (
                            <Chip
                              label="Kết thúc"
                              variant="outlined"
                              className={classes.labelEnd}
                            />
                          )}
                        </TableCell>
                        <TableCell align="left">
                          <ActionMoreMenu id={_id} activeCode={activeCode} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell
                      align="center"
                      colSpan={6}
                      sx={{ py: 3 }}
                    ></TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={discountList?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
