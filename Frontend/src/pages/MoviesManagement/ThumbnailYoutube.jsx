import { Box } from "@mui/material";
import React from "react";

import getVideoId from "../../utils/getVideoIdFromUrlYoutube";
import BtnPlay from "../../components/BtnPlay";
// import { useStyles } from "./styles";

export default function ThumbnailYoutube({ urlYoutube }) {
  return (
    <Box
      sx={{
        cursor: "pointer",
        display: "inline-block",
        width: 64,
        height: 64,
        objectFit: "cover",
        position: "relative",
        "&:hover > div": {
          opacity: 1,
        },
        "& > div > img": {
          verticalAlign: "top",
        },
      }}
    >
      <img
        src={`https://img.youtube.com/vi/${getVideoId(
          urlYoutube
        )}/mqdefault.jpg`}
        alt="trailer"
        className="w-full h-full rounded"
      />
      <BtnPlay width={40} height={40} urlYoutube={urlYoutube} />
    </Box>
  );
}
