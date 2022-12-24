import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  addbg: {
    backgroundImage: (props) => `url(${props.bg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    paddingTop: "147.9%",
    borderRadius: 4,
  },
  //   film: {
  //     cursor: "auto",
  //     "&:hover > film__content > film__button > a ": {
  //       opacity: "1",
  //       transition: " all 0.2s",
  //     },
  //     "&:hover > film__img > film__poster > play__trailer": {
  //       opacity: "1",
  //       transition: "all 0.2s",
  //     },
  //     "&:hover > film__img > film__poster > film__overlay": {
  //       opacity: "1",
  //       transition: "all 0.2s",
  //     },
  //   },
  //   film__img: {
  //     position: "relative",
  //   },
  //   poster: {
  //     width: "100%",
  //     borderRadius: "3%",
  //   },
  //   film__overlay: {
  //     cursor: "pointer",
  //     position: "absolute",
  //     width: "100%",
  //     height: "100%",
  //     top: "0",
  //     background: "linear-gradient(to top, #000, transparent 100%)",
  //     opacity: "0",
  //     transition: "all 0.2 s 0.2 s",
  //   },
  //   film__poster: {
  //     position: "relative",
  //   },
}));
export { useStyles };
