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
  Tab,
} from "@mui/material";

import { filter } from "lodash";
import TicketListHead from "../../components/Ticket/TicketListHead";
import TicketListToolbar from "../../components/Ticket/TicketToolbar";
import {
  getAllReviews,
  resetReviewManagement,
} from "../../redux/actions/Review";
import ActiveReview from "./ActiveReview";
import ReviewMoreMenu from "../../components/Review/ReviewMoreMenu";
import DeleteReview from "./DeleteReview";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import formatDate from "../../utils/formatDate";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const TABLE_HEAD = [
  { id: "movieId", label: "Tên phim", alignRight: false },
  { id: "photo", label: "Hình ảnh", alignRight: false },
  { id: "fullName", label: "Người đánh giá", alignRight: false },
  { id: "review", label: "Nội dung bình luận", alignRight: false },
  { id: "rating", label: "Số sao", alignRight: false },
  { id: "createdAt", label: "Ngày bình luận", alignRight: false },
  { id: "active", label: "Trạng thái", alignRight: false },
  { id: "delete", label: "Thao tác", alignRight: false },
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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_ticket) => _ticket._id.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function ReviewManagement() {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const {
    commentList,
    successUpdateActiveReview,
    successDeleteReview,
    errorDeleteReview,
    errorUpdateActiveReview,
  } = useSelector((state) => state.ReviewReducer);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterNameMovie, setFilterNameMovie] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();

  commentList?.sort(
    (a, b) => formatDate(b.createdAt).getTime - formatDate(a.createdAt).getTime
  );

  useEffect(() => {
    // get list user lần đầu
    if (!commentList) {
      dispatch(getAllReviews());
    }
    return () => dispatch(resetReviewManagement());
  }, []);

  useEffect(() => {
    if (successDeleteReview) {
      enqueueSnackbar("Xoá bình luận thành công!", { variant: "success" });
      dispatch(getAllReviews());
    }
    if (errorDeleteReview) {
      enqueueSnackbar(errorDeleteReview, { variant: "error" });
    }
  }, [successDeleteReview, errorDeleteReview]);

  useEffect(() => {
    if (successUpdateActiveReview) {
      enqueueSnackbar("Duyệt bình luận thành công!", { variant: "success" });
    }
    if (errorUpdateActiveReview) {
      enqueueSnackbar(errorUpdateActiveReview, { variant: "error" });
    }
  }, [successUpdateActiveReview, errorUpdateActiveReview]);

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
    setFilterNameMovie(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - commentList?.length) : 0;

  const filteredReivew = applySortFilter(
    commentList,
    getComparator(order, orderBy),
    filterNameMovie
  );

  const isUserNotFound = commentList?.length === 0;

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
      Danh sách
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
              Danh sách đánh giá
            </Typography>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Stack>
        </Stack>
        <Card>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                sx={{
                  backgroundColor: "#f4f6f8",
                  color: "#637381",
                  padding: "0 10px",
                }}
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab sx={{ flexDirection: "row" }} label="Tất cả" value="1" />
                <Tab sx={{ flexDirection: "row" }} label="Đã duyệt" value="2" />
                <Tab
                  sx={{ flexDirection: "row" }}
                  label="Chưa duyệt"
                  value="3"
                />
              </TabList>
            </Box>
            <TabPanel
              value="1"
              sx={{ "&.MuiTabPanel-root": { paddingTop: "10px !important" } }}
            >
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TicketListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={commentList?.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    // onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredReivew
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const {
                          _id,
                          movieId,
                          userId,
                          createdAt,
                          review,
                          rating,
                          active,
                        } = row;
                        return (
                          <TableRow
                            hover
                            key={_id}
                            tabIndex={-1}
                            name="checkbox"
                          >
                            <TableCell align="left">{movieId.name}</TableCell>
                            <TableCell align="left">
                              <Tooltip
                                placement="right"
                                id="test"
                                title={
                                  <img src={movieId.photo} width={170} alt="" />
                                }
                              >
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    width: 64,
                                    height: 84,
                                    objectFit: "cover",
                                    position: "relative",
                                    "&:hover > div": {
                                      opacity: 1,
                                    },
                                    "& > div > img": {
                                      verticalAlign: "top",
                                    },
                                  }}
                                >
                                  <img
                                    className="w-full h-full rounded"
                                    src={movieId.photo}
                                    alt="poster movie"
                                    aria-label="test"
                                  />
                                </Box>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="left">
                              {userId.fullName}
                            </TableCell>
                            <TableCell align="left">{review}</TableCell>
                            <TableCell align="left">
                              <Rating
                                value={rating}
                                precision={0.5}
                                readOnly
                                sx={{ fontSize: 20 }}
                              />
                            </TableCell>
                            <TableCell align="left">
                              {new Date(createdAt).toLocaleDateString()},{" "}
                              {new Date(createdAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TableCell>
                            <TableCell align="left">
                              <ActiveReview active={active} id={_id} />
                            </TableCell>
                            <TableCell align="center">
                              <DeleteReview id={_id} />
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
                count={commentList?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TabPanel>
            <TabPanel
              value="2"
              sx={{ "&.MuiTabPanel-root": { paddingTop: "10px !important" } }}
            >
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TicketListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={commentList?.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    // onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredReivew
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .filter((row) => row.active)
                      .map((row, index) => {
                        const {
                          _id,
                          movieId,
                          userId,
                          createdAt,
                          review,
                          rating,
                          active,
                        } = row;
                        return (
                          <TableRow
                            hover
                            key={_id}
                            tabIndex={-1}
                            name="checkbox"
                          >
                            <TableCell align="left">{movieId.name}</TableCell>
                            <TableCell align="left">
                              <Tooltip
                                placement="right"
                                id="test"
                                title={
                                  <img src={movieId.photo} width={170} alt="" />
                                }
                              >
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    width: 64,
                                    height: 84,
                                    objectFit: "cover",
                                    position: "relative",
                                    "&:hover > div": {
                                      opacity: 1,
                                    },
                                    "& > div > img": {
                                      verticalAlign: "top",
                                    },
                                  }}
                                >
                                  <img
                                    className="w-full h-full rounded"
                                    src={movieId.photo}
                                    alt="poster movie"
                                    aria-label="test"
                                  />
                                </Box>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="left">
                              {userId.fullName}
                            </TableCell>
                            <TableCell align="left">{review}</TableCell>
                            <TableCell align="left">
                              <Rating
                                value={rating}
                                precision={0.5}
                                readOnly
                                sx={{ fontSize: 20 }}
                              />
                            </TableCell>
                            <TableCell align="left">
                              {new Date(createdAt).toLocaleDateString()},{" "}
                              {new Date(createdAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TableCell>
                            <TableCell align="left">
                              <ActiveReview active={active} id={_id} />
                            </TableCell>
                            <TableCell align="center">
                              <DeleteReview id={_id} />
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
                count={commentList?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TabPanel>

            <TabPanel
              value="3"
              sx={{ "&.MuiTabPanel-root": { paddingTop: "10px !important" } }}
            >
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TicketListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={commentList?.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    // onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredReivew
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .filter((row) => !row.active)
                      .map((row, index) => {
                        const {
                          _id,
                          movieId,
                          userId,
                          createdAt,
                          review,
                          rating,
                          active,
                        } = row;
                        return (
                          <TableRow
                            hover
                            key={_id}
                            tabIndex={-1}
                            name="checkbox"
                          >
                            <TableCell align="left">{movieId.name}</TableCell>
                            <TableCell align="left">
                              <Tooltip
                                placement="right"
                                id="test"
                                title={
                                  <img src={movieId.photo} width={170} alt="" />
                                }
                              >
                                <Box
                                  sx={{
                                    display: "inline-block",
                                    width: 64,
                                    height: 84,
                                    objectFit: "cover",
                                    position: "relative",
                                    "&:hover > div": {
                                      opacity: 1,
                                    },
                                    "& > div > img": {
                                      verticalAlign: "top",
                                    },
                                  }}
                                >
                                  <img
                                    className="w-full h-full rounded"
                                    src={movieId.photo}
                                    alt="poster movie"
                                    aria-label="test"
                                  />
                                </Box>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="left">
                              {userId.fullName}
                            </TableCell>
                            <TableCell align="left">{review}</TableCell>
                            <TableCell align="left">
                              <Rating
                                value={rating}
                                precision={0.5}
                                readOnly
                                sx={{ fontSize: 20 }}
                              />
                            </TableCell>
                            <TableCell align="left">
                              {new Date(createdAt).toLocaleDateString()},{" "}
                              {new Date(createdAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TableCell>
                            <TableCell align="left">
                              <ActiveReview active={active} id={_id} />
                            </TableCell>
                            <TableCell align="center">
                              <DeleteReview id={_id} />
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
                count={commentList?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TabPanel>
          </TabContext>
        </Card>
      </Container>
    </>
  );
}
