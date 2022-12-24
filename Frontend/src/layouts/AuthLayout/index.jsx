import React from "react";
import { Link as RouterLink } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));
export default function AuthLayout(props) {
  return (
    <HeaderStyle>
      <RouterLink to="/">
        <Box
          component="img"
          src="../img/logo.svg"
          sx={{ width: 40, height: 40 }}
        />
      </RouterLink>

      <Typography
        variant="body2"
        sx={{
          mt: { md: -2 },
        }}
      >
        {props.children}
      </Typography>
    </HeaderStyle>
  );
}
