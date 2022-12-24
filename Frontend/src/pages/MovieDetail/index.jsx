import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getDetailMovie } from "../../redux/actions/Movie";
import { RESET_MOVIE_DETAIL } from "../../redux/constants/Movie";
import MovieItem from "./MovieItem";

export default function MovieDetail() {
  const { successDetailMovie, errorDetailMovie } = useSelector(
    (state) => state.MovieReducer
  );
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(
    function () {
      dispatch(getDetailMovie(params.idMovie));
      return () => {
        dispatch({ type: RESET_MOVIE_DETAIL });
      };
    },
    [params.idMovie]
  );

  if (errorDetailMovie) {
    return <div>{errorDetailMovie}</div>;
  }
  return (
    <>
      <MovieItem successDetailMovie={successDetailMovie[0]} />
    </>
  );
}
