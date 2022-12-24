import React, { useState } from "react";
import { CircularProgress, Rating } from "@mui/material";

import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useStyles } from "./styles";
import BtnPlay from "../../../components/BtnPlay";
import { useSelector } from "react-redux";
import formatDate from "../../../utils/formatDate";
import Tap from "../Tap";
import { selectCommentByMaPhimAndCommentTest } from "../../../redux/selector/MovieDetail";

export default function MovieItem({ successDetailMovie: data }) {
  const params = useParams();
  const [onClickBtnMuave, setOnClickBtnMuave] = useState(0);
  const [quantityComment, setQuantityComment] = useState(0);
  const [readHide, setReadHide] = useState(false);
  const { commentList } = useSelector((state) =>
    selectCommentByMaPhimAndCommentTest(state, params.idMovie)
  );
  const onIncreaseQuantityComment = (value) => {
    setQuantityComment(value);
  };
  console.log("data", data);
  const classes = useStyles({ bannerImg: data?.banner, movieImg: data?.photo });
  const [imageNotFound, setImageNotFound] = useState(false);
  let location = useLocation();
  const totalReviewer = commentList?.length;
  // reduce tính tổng
  const totalReview = commentList?.reduce((total, item) => {
    return total + item.rating;
  }, 0);
  const ratingMovie = totalReview / totalReviewer;
  const handleBtnMuaVe = () => {
    setOnClickBtnMuave(Date.now());
  };

  return (
    <div className={classes.desktop}>
      <div className={classes.top}>
        <div className={classes.gradient}></div>
        <div className={classes.bannerBlur}>
          {imageNotFound && <div className={classes.withOutImage}></div>}
        </div>
        <div className={classes.topInfo}>
          <div className={classes.imgTrailer}>
            <BtnPlay urlYoutube={data?.trailer} />
            {/* xử lý khi url hình bị lỗi */}
            <img
              src={data?.photo}
              alt="poster"
              style={{ display: "none" }}
              onError={(e) => {
                e.target.onerror = null;
                setImageNotFound(true);
              }}
            />
            {imageNotFound && <div className={classes.withOutImage}></div>}
          </div>
          <div className={classes.shortInfo}>
            <span className={classes.c18}>C18</span>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-3xl">
              {data?.name}
            </h1>
            <ul className="flex flex-wrap items-center text-white text-opacity-60">
              <li className={classes.movieTitle}> {data?.name}</li>
              <li className="mx-2 text-base font-normal">·</li>
              <li className={classes.movieTitle}>2022</li>
              <li className="mx-2 text-base font-normal">·</li>
              <li className={classes.movieTitle}>{data?.duration} phút</li>
            </ul>
            <h3 className="text-xl mt-3 font-bold text-white text-opacity-90">
              Nội dung
            </h3>
            <div
              className={`${classes.movieTitle} mt-2 text-sm leading-relaxed  text-opacity-70`}
            >
              {readHide ? data?.description : data?.description.slice(0, 258)}
              {readHide ? (
                <span
                  onClick={(e) => setReadHide(!readHide)}
                  className="read-or-hide cursor-pointer pl-1  hover:underline text-yellow-300 text-sm"
                >
                  Thu gọn
                </span>
              ) : (
                <span
                  onClick={(e) => setReadHide(!readHide)}
                  className="read-or-hide cursor-pointer pl-1  hover:underline text-yellow-300 text-sm"
                >
                  ...Xem thêm
                </span>
              )}
            </div>

            <div className="mt-3 text-sm">
              <div className="mb-2 flex flex-nowrap space-x-4 md:space-x-5">
                <div>
                  <div className={classes.movieTitle}>Ngày chiếu</div>
                  <div className=" mt-1 font-bold text-white">
                    {formatDate(data?.releaseDate?.slice(0, 10)).dDMmYy}
                  </div>
                </div>
                <div>
                  <div className={classes.movieTitle}>Thể loại</div>
                  <div className=" mt-1 font-bold text-white">
                    {data?.genre}
                  </div>
                </div>
                <div>
                  <div className={classes.movieTitle}>Quốc gia</div>
                  <div className=" mt-1 font-bold text-white">Mỹ</div>
                </div>
              </div>
            </div>

            {/* {data?.idTheater ? (
              <p>
                {`${data?.duration ?? "120"} phút - ${
                  data ? data?.idTheater[0]?.type : ""
                }/Digital`}{" "}
              </p>
            ) : (
              <p>
                {`${data?.duration ?? "120"} phút -  2D/Digital
                `}
              </p>
            )} */}

            <button className={classes.btnMuaVe} onClick={handleBtnMuaVe}>
              {!data?.nowShowing ? "Thông tin phim" : "Mua vé"}
            </button>
          </div>
          <div className={classes.rate}>
            <div className={classes.circular}>
              <span className={classes.danhGia}>
                {" "}
                {ratingMovie ? ratingMovie.toFixed(1) : 0}{" "}
              </span>
              <CircularProgress
                variant="determinate"
                size="100%"
                value={100}
                className={classes.behined}
                color="success"
              />
              <CircularProgress
                variant="determinate"
                size="100%"
                value={10 * 10}
                className={classes.fabProgress}
                color="success"
              />
            </div>
            <div className={classes.rateStar}>
              <Rating value={ratingMovie.toFixed(1)} precision={0.5} readOnly />
            </div>
            <span>{quantityComment} người đánh giá</span>
          </div>
        </div>
      </div>
      <Tap
        data={data}
        onClickBtnMuave={onClickBtnMuave}
        onIncreaseQuantityComment={onIncreaseQuantityComment}
      />
    </div>
  );
}
