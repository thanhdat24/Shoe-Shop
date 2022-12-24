import { makeStyles, withStyles } from "@mui/styles";

import { underLine } from "../../styles/materialUi";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

const useStyles = makeStyles({
  cumRapItem: {
    transition: "height .2s",
    overflowY: "hidden",
    ...underLine,
  },
  topInfo: {
    paddingBottom: 20,
    cursor: "pointer",
  },
  imgTheater: {
    width: 50,
    float: "left",
    display: "inline-block",
    border: "1px solid #ebebec",
  },
  wrapInfo: {
    paddingLeft: 4,
  },

  digital: {
    marginBottom: 5,
    fontWeight: 500,
  },
  text__first: (props) => ({
    color: props.color ? `${props.color}` : "#000",
    fontWeight: "500",
    fontSize: props.testSize ? props.testSize : 14,
  }),
  text__second: {
    color: "#000",
    fontWeight: "500",
  },
  address: {
    fontSize: 14,
    color: "#9b9b9b",
  },
});

const Accordion = withStyles({
  root: {
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    alignItems: "center",
    gap: 12,
    "& > img": {
      width: 50,
    },
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    gap: "10px",
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
  },
}))(MuiAccordionDetails);

export { useStyles, Accordion, AccordionSummary, AccordionDetails };
