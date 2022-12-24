import React, { memo } from "react";
import { underLine, customScrollbar } from "../../../../styles/materialUi";
import ListMovie from "../ListMovie";
import { useStyles } from "./styles";

function ListTheaterCluster(props) {
  const { listTheaterCluster, color } = props;
  const [valueTheaterCluster, setValueTheaterCluster] = React.useState(0);

  const classes = useStyles({ underLine, customScrollbar, color });
  const handleChangeTheaterCluster = (e) => {
    setValueTheaterCluster(Number(e.currentTarget.getAttribute("index")));
  };
  return (
    <div className={classes.flexCumRap}>
      <div className={classes.lstCumRap}>
        {listTheaterCluster.map((theaterCluster, index) => (
          <div
            className={classes.cumRap}
            index={index}
            onClick={(e) => handleChangeTheaterCluster(e)}
            key={theaterCluster._id}
            style={{ opacity: valueTheaterCluster === index ? "1" : ".5" }}
          >
            <img
              className={classes.cumRap__img}
              src={theaterCluster.photo}
              alt="theater"
            />

            <div className={classes.cumRap__info}>
              <p className={classes.text__first}>
                <span>{theaterCluster?.name?.split("-")[0]}</span>
                <span className={classes.text__second}>
                  -{theaterCluster.name?.split("-")[1]}
                </span>
              </p>
              <p className={classes.cumRap__address}>
                {theaterCluster?.address}
              </p>
            </div>
          </div>
        ))}
      </div>
      {listTheaterCluster?.map((theaterCluster, index) => (
        <ListMovie
          listMovie={theaterCluster.movieSchedule}
          key={theaterCluster._id}
          hidden={valueTheaterCluster !== index}
        />
      ))}
    </div>
  );
}
export default memo(ListTheaterCluster);
