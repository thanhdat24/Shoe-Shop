import { makeStyles } from "@mui/styles";
import { underLineDashed } from "../../../styles/materialUi";

const useStyles = makeStyles({
  resultBookticket: {
    textAlign: "left",
    lineHeight: "30px",
    padding: (props) => (props.isMobile ? 23 : 40),
    width: "100%",
  },
  resultBookticketOrder: {
    textAlign: "left",
    lineHeight: "30px",
    padding: "40px 40px 20px 40px",
    width: "100%",
  },
  modal: {
    textAlign: "center !important",
    fontSize: 17,
    width: "500px !important",
    borderRadius: "20px !important",
    alignItems: "center !important",
    overflowX: "hidden !important",
    maxHeight: "calc(100% - 20px) !important",
  },
  infoTicked: {
    display: "flex",
    gap: "5%",
  },
  infoTicked__img: (props) => ({
    flex: "30%",
    backgroundImage: `url(${props.data?.moviePhoto})`,
    borderRadius: "8px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }),

  infoTickedOrder__img: (props) => ({
    flex: "30%",
    backgroundImage: `url(${props.notification?.idShowtime.idMovie.photo})`,
    borderRadius: "8px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  }),

  infoTicked__txt: {
    flex: "70%",
  },
  tenPhim: {
    fontSize: 19,
    fontWeight: 500,
    ...underLineDashed,
  },
  text__first: (props) => ({
    color: `${props.color}`,
    fontWeight: "500",
  }),
  text__second: {
    color: "#000",
    fontWeight: "500",
  },
  diaChi: {
    color: "#9B9B9B",
  },
  table: {
    marginTop: 10,
    width: "100%",
  },
  infoResult_label: {
    margin: "30px 0px 10px",
    fontWeight: 400,
    fontSize: 30,
  },
  paymentColor: {
    color: "#f79320",
  },
  errorColor: {
    color: "#fb4226",
  },
  noteresult: {
    fontStyle: "italic",
    fontWeight: 600,
  },
});
export default useStyles;
