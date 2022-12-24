import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  desktop: {
    // color: "#e9e9e9",
    backgroundColor: "rgb(10, 32, 41)",
  },
  top: {
    width: "100%",
    height: "33vw",
    position: "relative",
  },

  bannerBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundImage: (props) => `url(${props.bannerImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 2,
    background:
      "linear-gradient(to right,rgba(0,0,0,1)150px,rgba(0,0,0,.6)100%)",
  },
  topInfo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: "100%",
    height: 320,
    maxWidth: 1175,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#e9e9e9",
    zIndex: 10,
  },
  imgTrailer: {
    width: "22%",
    height: "116%",
    position: "relative",
    backgroundImage: (props) => `url(${props.movieImg})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    "&:hover > div ": { opacity: 1 },
  },
  movieTitle: {
    color: "#FFFFFF99",
  },
  img: {
    width: "100%",
    borderRadius: 4,
  },
  shortInfo: {
    width: "59%",
    padding: "0px 40px",
  },
  movieName: {
    fontSize: 24,
  },
  c18: {
    marginRight: "6px",
    verticalAlign: "13%",
    backgroundColor: "#fb4226",
    color: "#fff",
    fontSize: "16px",
    borderRadius: "4px",
    padding: "0 5px",
    display: "inline-block",
    textAlign: "center",
    minWidth: "33px",
  },
  btnMuaVe: {
    fontSize: "16px",
    borderRadius: "4px",
    background: "0 0",
    padding: "11px 25px",
    transition: "all .2s",
    marginTop: "25px",
    marginBottom: "20px",
    backgroundColor: "#fb4226",
    border: "none",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#b42a14",
    },
  },

  rate: {
    width: "16%",
    height: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  circular: {
    position: "relative",
    height: 126,
    width: 126,
  },
  danhGia: {
    fontSize: 53,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  fabProgress: {
    color: "#7ed321",
    position: "absolute",
    top: 0,
    left: 0,
  },
  behined: {
    color: "#829869",
    position: "absolute",
    top: 0,
    left: 0,
  },
  rateStar: {
    width: "fit-content",
    "& .MuiRating-iconEmpty": {
      color: "rgba(255, 180, 0, 0.3)",
    },
  },

  withOutImage: {
    borderRadius: 4,
    width: "100%",
    height: "100%",
    animationName: `$myEffect`,
    animationDuration: "3s",
    animationTimingFunction: `${theme.transitions.easing.easeInOut}`,
    animationIterationCount: "infinite",
    background: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
    backgroundSize: "400% 400%",
  },
  "@keyframes myEffect": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
}));
export { useStyles };
