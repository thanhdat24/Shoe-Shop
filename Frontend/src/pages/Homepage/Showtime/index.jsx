import React, { useState, useRef, useEffect } from "react";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import _ from "lodash";
import { useSelector } from "react-redux";

import { AppBar, Tab, Tabs } from "@mui/material";
import { useStyles } from "./styles";
import MovieList from "./MovieList";

export function SampleNextArrow(props) {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <ArrowForwardIosIcon
      style={{ right: "-82px" }}
      onClick={onClick}
      className={classes.Arrow}
    />
  );
}

export function SamplePrevArrow(props) {
  const classes = useStyles();
  const { onClick } = props;
  return (
    <ArrowBackIosIcon
      style={{ left: "-82px" }}
      onClick={onClick}
      className={classes.Arrow}
    />
  );
}

export default function Showtime() {
  const [value, setValue] = useState({ value: 0, fade: true, notDelay: 0 });
  const { errorMovieList, movieList } = useSelector(
    (state) => state.MovieReducer
  );

  const timeout = useRef(null);
  const [arrayData, setArrayData] = useState({
    dailyMovieList: null,
    comingMovieList: null,
  });
  const classes = useStyles({
    fade: value.fade,
    value: value.value,
    notDelay: value.notDelay,
  });
  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  useEffect(() => {
    // movieList chứa tất cả các ngày, cần lọc

    let dailyMovieList = _.filter(movieList?.data, ["nowShowing", true]);
    let comingMovieList = _.filter(movieList?.data, ["comingSoon", true]);

    setArrayData({ dailyMovieList, comingMovieList });
  }, [movieList]);

  const handleChange = (e, newValue) => {
    setValue((value) => ({ ...value, notDelay: newValue, fade: false }));
    timeout.current = setTimeout(() => {
      setValue((value) => ({ ...value, value: newValue, fade: true }));
    }, 100);
  };

  if (errorMovieList) {
    return <div>{errorMovieList}</div>;
  }

  return (
    <div style={{ paddingTop: "80px" }} id="lichchieu">
      <AppBar className={classes.appBar} position="static">
        <Tabs
          classes={{
            root: classes.tabBar,
            flexContainer: classes.flexContainer,
            indicator: classes.indicator,
          }}
          value={value.value}
          onChange={handleChange}
        >
          <Tab
            disableRipple
            className={`${classes.tabButton} ${classes.tabDangChieu}`}
            label="Đang chiếu"
            // sx={{
            //   "& .MuiTab-root": {
            //     "&.Mui-selected": {
            //       color: "primary.main",
            //       fontWeight: "fontWeightMedium",
            //     },
            //   },
            // }}
          />
          <Tab
            disableRipple
            className={`${classes.tabButton} ${classes.tabSapChieu}`}
            label="Sắp chiếu"
            sx={{
              color: "#000",
              fontSize: "22px",
            }}
          />
        </Tabs>
      </AppBar>
      <div className={classes.listMovie}>
        <MovieList arrayData={arrayData} value={value} />
      </div>
    </div>
  );
}
