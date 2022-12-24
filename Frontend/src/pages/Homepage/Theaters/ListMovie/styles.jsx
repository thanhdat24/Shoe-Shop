import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  lstPhim: (props) => ({
    flex: "0 0 60%",
    height: "705px",
    overflowY: "auto",
    borderLeft: "1px solid #ebebec",
    ...props.customScrollbar,
  }),
  phim: (props) => ({
    paddingBottom: "17px",
    paddingTop: "20px",
    paddingRight: "15px",
    paddingLeft: "20px",
    ...props.underLine,
  }),
  phim__info: {
    display: "flex",
  },
  phim__img: {
    width: 63,
    height: 97,
    objectFit: "cover",
    borderRadius: "0.375rem",
  },
  phim__text: {
    paddingLeft: "15px",
    paddingTop: "6px",
    width: "calc(100% - 50px)",
  },
  phim__text_name: {
    fontWeight: 500,
    textTransform: "capitalize",
  },
  phim__duration: {
    padding: "6px 0",
    display: "inline-block",
    fontSize: 13,
    color: "#9b9b9b",
  },
});
export { useStyles };
