import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Rating,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import useStyles from "./styles";
import PropTypes from "prop-types";
import formatDate from "../../../utils/formatDate";
import scroll from "../../../utils/scroll";
import { scroller } from "react-scroll";
import { UNKNOWN_USER } from "../../../constants/config";
// import { toast } from "react-toastify";

import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";

import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useEffect } from "react";
import LichChieu from "./LichChieu";
import moment from "moment";
import {
  addReview,
  getAllReviews,
  likeComment,
} from "../../../redux/actions/Review";
import { selectCommentByMaPhimAndCommentTest } from "../../../redux/selector/MovieDetail";
import { useSnackbar } from "notistack";
// bình luận bao nhiêu giấy trước
// import "moment/locale/vi";
// moment.locale("vi");

function TabPanel(props) {
  const { isMobile, children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      <Box p={index === 0 ? 0 : 3}>{children}</Box>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
export default function CenteredTabs({
  data,
  onClickBtnMuave,
  onIncreaseQuantityComment,
}) {
  let location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [hover, setHover] = React.useState(-1);
  const [valueTab, setValueTab] = useState(0);
  const { currentUser } = useSelector((state) => state.AuthReducer);

  const [croll, setCroll] = useState(0);
  const [openComment, setOpenComment] = useState(false);
  const [warningtext, setwarningtext] = useState(false);
  const [dataComment, setdataComment] = useState({
    review: "",
    rating: 0.5,
    likes: 0,
    userLikeThisComment: [],
  });
  const [commentListDisplay, setCommentListDisplay] = useState({
    comment: [],
    page: 5,
    hideBtn: false,
    idScrollTo: "",
  });
  const { commentList } = useSelector((state) =>
    selectCommentByMaPhimAndCommentTest(state, params.idMovie)
  );

  const {
    postReviewObj,
    loadingAddReview,
    loadingLikeComment,
    likeCommentObj,
  } = useSelector((state) => state.ReviewReducer);
  const labels = {
    0.5: "0.5",
    1: "1",
    1.5: "1.5",
    2: "2",
    2.5: "2.5",
    3: "3",
    3.5: "3.5",
    4: "4",
    4.5: "4.5",
    5: "5",
  };
  const classes = useStyles({ hideBtn: commentListDisplay.hideBtn });
  // useEffect(() => {
  //   return () => dispatch(resetReviewManagement());
  // });
  // phục vụ kh nhấp btn mua vé
  useEffect(() => {
    window.scrollTo(0, 0); // ngăn window.history.scrollRestoration = 'auto';
    setValueTab(() => 0);
    setCroll(() => onClickBtnMuave);
  }, [onClickBtnMuave]); // khi click muave thì mới mở tap 0 > đổi giá trị croll để scroll tới TapMovieDetail

  useEffect(() => {
    if (onClickBtnMuave !== 0) {
      // không scroll khi mới load topDesktopMovieDetail
      scroll("TapMovieDetail");
    }
  }, [croll]); // khi nhấn muave và đã hoàn thành mở tap 0 thì scroll

  function getLabelText(value) {
    return `${dataComment.rating} Star${value !== 1 ? "s" : ""}, ${
      labels[value]
    }`;
  }
  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  const handletyping = (event) => {
    if (event.target.value.length >= 10) {
      // nếu comment quá ngắn
      setwarningtext(false);
    }

    setdataComment((data) => ({ ...data, review: event.target.value }));
  };

  const handlePostComment = () => {
    if (loadingAddReview) {
      return;
    }
    if (dataComment.review.length < 10) {
      // nếu comment quá ngắn
      setwarningtext(true);
      return;
    }
    setwarningtext(false);
    const currentISOString = new Date().toISOString();

    dispatch(
      addReview({
        ...dataComment,
        createdAt: currentISOString,
        movieId: params.idMovie,
        userId: currentUser?.user._id,
      })
    );

    setOpenComment(false);
    enqueueSnackbar("Đánh giá thành công, chờ duyệt bạn nhé!", {
      variant: "success",
    });
    setdataComment({
      review: "",
      rating: 0.5,
    });
  };

  const setopenMore = () => {
    let hideBtn = false;
    let addComment = commentList.length % 5;
    if (commentList.length % 5 === 0) {
      addComment = 5;
    }
    if (commentListDisplay.page + addComment === commentList.length) {
      hideBtn = true;
    }
    const idScrollTo = `idComment${
      commentList[commentListDisplay.page].createdAt
    }`;
    const page = commentListDisplay.page + 5;
    const comment = commentList.slice(0, page);
    setCommentListDisplay((data) => ({
      ...data,
      comment,
      page,
      hideBtn,
      idScrollTo,
    }));
  };

  const handleLike = (id) => {
    if (loadingLikeComment) {
      return;
    }
    if (!currentUser) {
      isLogin();
      return;
    }
    // tăng giảm số lượng like và add/remove email đã like
    const commentUserLiked = commentList.find((item) => item.id === id);
    if (commentUserLiked.userLikeThisComment.includes(currentUser.user.email)) {
      // xóa user khỏi danh sách liked comment, trừ số lượng like
      commentUserLiked.userLikeThisComment =
        commentUserLiked.userLikeThisComment.filter((item) => {
          return item !== currentUser.user.email;
        });
      commentUserLiked.likes = commentUserLiked.likes - 1;
    } else {
      commentUserLiked.userLikeThisComment.push(currentUser.user.email);
      commentUserLiked.likes = commentUserLiked.likes + 1;
    }
    dispatch(likeComment(id, commentUserLiked));
  };

  useEffect(() => {
    // khi commentList lấy về thành công thì cập nhật số người bình luận
    if (commentList?.length) {
      onIncreaseQuantityComment(commentList?.length);
    }
  }, [commentList]);

  useEffect(() => {
    // mỗi khi mount component, postComment, likeComment thành công thì call api lấy comment mới
    dispatch(getAllReviews());
    if (postReviewObj) {
      // reset text comment
      setdataComment((data) => ({ ...data, review: "" }));
    }
  }, [postReviewObj, likeCommentObj]);

  useEffect(() => {
    const comment = commentList?.slice(0, commentListDisplay.page);
    setCommentListDisplay((data) => ({ ...data, comment }));
  }, [commentList]);

  useEffect(() => {
    if (commentListDisplay.idScrollTo) {
      scroller.scrollTo(commentListDisplay.idScrollTo, {
        duration: 800,
        offset: -79,
        smooth: "easeInOutQuart",
      });
    }
  }, [commentListDisplay.idScrollTo]);

  const isLogin = () => {
    if (!currentUser) {
      // nếu chưa đăng nhập
      Swal.fire({
        title: "Bạn cần phải đăng nhập",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Không",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/login", location.pathname);
        }
      });
    }
  };

  const handleClose = () => {
    setOpenComment(false);
  };
  const handleClickComment = () => {
    if (!currentUser) {
      isLogin();
      return;
    }
    setOpenComment(true);
    setwarningtext(false);
  };
  return (
    <div className={classes.root} id="TapMovieDetail">
      <AppBar
        position="static"
        color="default"
        classes={{ root: classes.appBarRoot }}
      >
        <Tabs
          value={valueTab}
          onChange={handleChange}
          centered
          classes={{ indicator: classes.indicator }}
        >
          {data?.nowShowing && (
            <Tab
              disableRipple
              label="Lịch Chiếu"
              classes={{ selected: classes.selectedTap, root: classes.tapRoot }}
            />
          )}
          <Tab
            disableRipple
            label="Thông Tin"
            classes={{ selected: classes.selectedTap, root: classes.tapRoot }}
          />
          <Tab
            disableRipple
            label="Đánh Giá"
            classes={{ selected: classes.selectedTap, root: classes.tapRoot }}
          />
        </Tabs>
      </AppBar>

      <TabPanel
        value={valueTab}
        index={!data?.nowShowing ? "hide" : 0}
        className="pb-4 pt-6"
      >
        {<LichChieu data={data} />}
      </TabPanel>

      <TabPanel value={valueTab} index={!data?.nowShowing ? 0 : 1}>
        <div className={`row text-white ${classes.detailMovie}`}>
          <div className="col-sm-6 col-xs-12">
            <div className="row mb-2">
              <p className={`float-left ${classes.contentTitle}`}>
                Ngày công chiếu
              </p>
              <p className={`float-left ${classes.contentInfo}`}>
                {formatDate(data?.releaseDate?.slice(0, 10)).dDMmYy}
              </p>
            </div>
            <div className="row mb-2">
              <p className={`float-left ${classes.contentTitle}`}>Đạo diễn</p>
              <p className={`float-left ${classes.contentInfo}`}>
                {" "}
                Adam Wingard{" "}
              </p>
            </div>
            <div className="row mb-2">
              <p className={`float-left ${classes.contentTitle}`}>Diễn viên</p>
              <p className={`float-left ${classes.contentInfo}`}>
                Kyle Chandler, Rebecca Hall, Eiza González, Millie Bobby Brown
              </p>
            </div>
            <div className="row mb-2">
              <p className={`float-left ${classes.contentTitle}`}>Thể Loại</p>
              <p className={`float-left ${classes.contentInfo}`}>
                {data?.genre}
              </p>
            </div>
            <div className="row mb-2">
              <p className={`float-left ${classes.contentTitle}`}>Định dạng</p>
              {data?.idTheater ? (
                <p className={`float-left ${classes.contentInfo}`}>
                  {`${data ? data?.idTheater[0].type : ""}/Digital`}{" "}
                </p>
              ) : (
                <p>
                  {`${data?.duration ?? "120"} phút -  2D/Digital
                `}
                </p>
              )}
            </div>
            <div className="row mb-2">
              <p className={`float-left ${classes.contentTitle}`}>
                Quốc Gia SX
              </p>
              <p className={`float-left ${classes.contentInfo}`}>Mỹ</p>
            </div>
          </div>
          <div className="col-sm-6 col-xs-12">
            <div className="row mb-2">
              <p className={`float-left ${classes.contentTitle}`}>Nội dung</p>
            </div>
            <div className="row mb-2">
              <p>{data?.description}</p>
            </div>
          </div>
        </div>
      </TabPanel>

      <TabPanel value={valueTab} index={location.state?.comingMovie ? 1 : 2}>
        <div className={classes.danhGia}>
          <div className={classes.inputRoot} onClick={handleClickComment}>
            <span className={classes.avatarReviewer}>
              <img
                src={currentUser ? currentUser?.user?.photo : UNKNOWN_USER}
                alt="avatar"
                className={classes.avatarImg}
              />
            </span>
            <input
              className={classes.inputReviwer}
              type="text"
              placeholder="Bạn nghĩ gì về phim này?"
              readOnly="readonly"
            />

            <span className={classes.imgReviewerStar}>
              <Rating value={5} size={"medium"} readOnly precision={0.5} />
            </span>
          </div>
        </div>
        <div
          className="text-center mb-2 text-white"
          hidden={!loadingAddReview && !loadingLikeComment}
        >
          <CircularProgress size={20} color="inherit" />
        </div>
        {commentListDisplay?.comment?.map(
          (item) =>
            item.active && (
              <div
                key={`${item?.createdAt}`}
                className={classes.itemDis}
                id={`idComment${item?.createdAt}`}
              >
                <div className={classes.infoUser}>
                  <div className={classes.left}>
                    <span className={classes.avatar}>
                      <img
                        src={item?.userId?.photo}
                        alt="avatar"
                        className={classes.avatarImg}
                      />
                    </span>
                    <span className={classes.liveUser}>
                      <p className={classes.userName}>
                        {item?.userId?.fullName}
                      </p>
                      <p className={classes.timePost}>
                        {moment(item?.createdAt).fromNow()}
                      </p>
                    </span>
                  </div>
                  <div className={classes.right}>
                    <p className="text-success">{item.rating}</p>
                    <Rating value={item.rating} precision={0.5} readOnly />
                  </div>
                  <div className="clearfix"></div>
                </div>
                <div className="py-3 mb-3 border-bottom">{item.review}</div>
                <span
                  className="d-inline-block"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleLike(item.id)}
                >
                  <span className="mr-2">
                    {((userLikeThisComment) => {
                      return (
                        <ThumbUpIcon
                          style={{
                            color: userLikeThisComment.includes(
                              currentUser?.user.email
                            )
                              ? "#fb4226"
                              : "#73757673",
                          }}
                        />
                      );
                    })(item.userLikeThisComment)}
                  </span>
                  <span style={{ color: "#737576" }}>
                    <span>{item.likes}</span> Thích
                  </span>
                </span>
              </div>
            )
        )}
        {commentList?.length > 5 && (
          <div className={classes.moreMovie}>
            <Button
              onClick={() => setopenMore()}
              variant="outlined"
              className={classes.moreMovieButton}
            >
              XEM THÊM
            </Button>
          </div>
        )}
      </TabPanel>

      <Dialog
        open={openComment}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        className={classes.dialog} //lay tat ca comment ra
      >
        <DialogTitle className={classes.rootcloseButton}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Grid container direction="column" justify="center" alignItems="center">
          {dataComment.rating !== null && (
            <span className={classes.pointPopup}>
              {labels[hover !== -1 ? hover : dataComment.rating]}
            </span>
          )}
          <Rating
            name="customStar"
            size="large"
            precision={0.5}
            value={dataComment.rating}
            className={classes.starPopup}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
            onChange={(event, newValue) => {
              setdataComment((data) => ({ ...data, rating: newValue }));
            }}
            getLabelText={getLabelText}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
          />
        </Grid>
        <DialogContent className={classes.dialogContent}>
          <TextField
            className={classes.textField}
            onChange={(event) => handletyping(event)}
            fullWidth
            value={dataComment.review}
            variant="outlined"
            label={
              dataComment.review
                ? ""
                : "Nói cho mọi người biết bạn nghĩ gì về phim này..."
            }
          />
        </DialogContent>
        <DialogActions className="justify-content-center flex-column px-4">
          {warningtext && (
            <DialogContentText className="text-danger">
              Phim đem đến cảm xúc tuyệt vời cho bạn chứ? Chia sẻ thêm nữa đi
              bạn ơi và nhớ gõ trên 10 kí tự nhé.
            </DialogContentText>
          )}
          <Button
            onClick={handlePostComment}
            variant="contained"
            className={classes.btnDang}
          >
            Đăng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
