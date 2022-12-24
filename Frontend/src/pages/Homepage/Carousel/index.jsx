import React, { useEffect } from "react";

import Slider from "react-slick";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import BtnPlay from "../../../components/BtnPlay";
import "./carousel.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useStyles } from "./styles";
import homeCarouselData from "../../../constants/homeCarouselData";
import SearchStickets from "../Search";
import { LOADING_BACKTO_HOME_COMPLETED } from "../../../redux/constants/Lazy";
export default function Carousel() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const settings = {
    dots: true,
    infinite: true,
    autoplaySpeed: 5000, //speed per sence
    autoplay: false,
    speed: 500,
    swipeToSlide: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slickdotsbanner",
  };

  useEffect(() => {
    dispatch({ type: LOADING_BACKTO_HOME_COMPLETED });
  }, []);
  function NextArrow(props) {
    const { onClick } = props;
    return (
      <ArrowForwardIosIcon
        style={{ right: "15px" }}
        onClick={onClick}
        className={classes.Arrow}
      />
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <ArrowBackIosIcon
        style={{ left: "15px" }}
        onClick={onClick}
        className={classes.Arrow}
      />
    );
  }

  return (
    <div id="carousel" className={classes.carousel}>
      <Slider {...settings}>
        {homeCarouselData.map((banner) => {
          return (
            <div key={banner.idMovie} className={classes.itemSlider}>
              <img src={banner.photo} alt="banner" className={classes.img} />
              <div
                className={classes.backgroundLinear}
                // onClick={() => history.push(`/movie/${banner.maPhim}`)}
              />
              <BtnPlay cssRoot={"play"} urlYoutube={banner.trailer} />
            </div>
          );
        })}
      </Slider>
      <SearchStickets />
    </div>
  );
}
