import { Tab, Tabs } from "@mui/material";
import React from "react";
import RightSection from "./RightSection";
import { useStyles } from "./styles";

// import RightSection from "./RightSection";

export default function LichChieu({ data }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        classes={{ root: classes.leftSection, indicator: classes.indicator }}
      >
        {data?.theaterSystemList?.map((theater) => (
          <Tab
            disableRipple
            key={theater._id}
            classes={{ root: classes.tabRoot }}
            sx={{
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
            label={
              <>
                <img
                  className={classes.logo}
                  src={theater?.logo}
                  alt="logoTheater"
                />
                <span>{theater?.name}</span>
              </>
            }
          />
        ))}
      </Tabs>
      <div className={classes.rightSection}>
        {!data?.theaterSystemList && (
          <p style={{ padding: 10 }}>
            Hiện tại chưa có lịch chiếu cho phim này
          </p>
        )}
        {data?.theaterSystemList?.map((theater, i) => (
          <div
            key={theater._id}
            style={{ display: value === i ? "block" : "none" }}
          >
            <RightSection
              movie={data}
              currentSelectedTheaterSystemList={theater}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
