import _ from "lodash";
import React, { memo } from "react";
import Trailer from "../../../../components/Trailer";

import { customScrollbar, underLine } from "../../../../styles/materialUi";
import ListShowtime from "./ListShowtime";
import { useStyles } from "./styles";
import moment from "moment";

function ListMovie(props) {
  const sortedArray = props.listMovie.sort(function (left, right) {
    return moment.utc(left.dateShow).diff(moment.utc(right.dateShow));
  });
  console.log("sortedArray", sortedArray);
  const classes = useStyles({ customScrollbar, underLine });
  let groupByTheaterCluster = _(sortedArray)
    .groupBy((x) => x.idMovie.name)
    .map((value, key) => ({ name: key, movieSchedule: value }))
    .value();

  const movieList = groupByTheaterCluster.map((item) => {
    return {
      ...item,
      _id: item.movieSchedule[0].idMovie._id,
      photo: item.movieSchedule[0].idMovie.photo,
      name: item.movieSchedule[0].idMovie.name,
      duration: item.movieSchedule[0].idMovie.duration,
      trailer: item.movieSchedule[0].idMovie.trailer,
    };
  });
  console.log("props.listMovie", props.listMovie);
  return (
    <div className={classes.lstPhim} hidden={props.hidden}>
      {/* div root danh sách phim */}
      {movieList?.map((movie) => (
        <div className={classes.phim} key={movie?._id}>
          <div className={classes.phim__info}>
            {/* div thong tin phim */}
            <img
              src={movie?.photo}
              className={classes.phim__img}
              alt={movie?.name}
            />
            <div className={classes.phim__text}>
              <p className={classes.phim__text_name}>{movie?.name}</p>
              <span className={classes.phim__duration}>
                {`${movie?.duration ?? "120"} phút - NC18`} -
                <Trailer urlYoutube={movie?.trailer} />
              </span>
              <p className="font-medium text-sm">2D Phụ Đề Việt</p>
            </div>
          </div>
          <div>
            {/* div danh sách ngày giờ chiếu */}
            <ListShowtime ListShowtimeByMovie={movie.movieSchedule} />
          </div>
        </div>
      ))}
    </div>
  );
}
export default memo(ListMovie);
