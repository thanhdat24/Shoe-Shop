import React, { useState, useMemo } from "react";
import ItemCumRap from "../../../../components/ItemCumRap";
import { selectData } from "../../../../redux/selector/MovieDetail";

// import { selectDesktopData } from "../../../../reducers/selector/MovieDetail";
import formatDate from "../../../../utils/formatDate";
import { useStyles } from "./styles";

export default function RightSection({
  currentSelectedTheaterSystemList,
  data,
}) {
  const [indexSelected, setindexSelected] = useState(0);
  const dataSelect = useMemo(
    () => selectData(currentSelectedTheaterSystemList),
    [currentSelectedTheaterSystemList]
  );
  const classes = useStyles();

  const handleSelectDay = (i) => {
    setindexSelected(i);
  };

  return (
    <div>
      <div className={classes.listDay}>
        {dataSelect?.arrayDay?.map((day, i) => (
          <div
            className={classes.dayItem}
            key={day}
            style={{ color: i === indexSelected ? "#fb4226" : "#000" }}
            onClick={() => handleSelectDay(i)}
          >
            <p>{formatDate(day).dayToday}</p>
            <p
              style={{
                fontSize: i === indexSelected ? "18px" : "16px",
                transition: "all .2s",
              }}
            >
              {formatDate(day).YyMmDd}
            </p>
          </div>
        ))}
      </div>
      {dataSelect?.allArrayCumRapChieuFilterByDay?.map(
        (arrayCumRapChieuFilterByDay, i) => (
          <div
            style={{ display: indexSelected === i ? "block" : "none" }}
            key={i}
          >
            {arrayCumRapChieuFilterByDay.map((item) => (
              <ItemCumRap
                key={item.theaterClusterName}
                theaterClusterName={item.theaterClusterName}
                theaterClusterAddress={item.theaterClusterAddress}
                theaterClusterPhoto={item.theaterClusterPhoto}
                
                idShowtime={item.idShowtime}
                moviesShedule={item.movieschedule}
                defaultExpanded={true}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
