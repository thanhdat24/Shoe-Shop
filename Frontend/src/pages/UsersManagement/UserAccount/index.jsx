import React from "react";
import {
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Box,
  Tab,
  Stack,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ChangePassword from "./ChangePassword";
import Info from "./Info";

export default function UsersManagement() {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      href="/admin/dashboard"
      color="text.primary"
    >
      Home
    </Link>,
    <Link
      underline="hover"
      key="2"
      href="/admin/users/account"
      color="text.primary"
    >
      User
    </Link>,
    <Typography key="3" color="inherit">
      Account Settings
    </Typography>,
  ];
  return (
    <Container
      sx={{ paddingRight: "0px !important", paddingLeft: "0px !important" }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
        mt={7.5}
      >
        <Stack spacing={2}>
          <Typography variant="h4" gutterBottom>
            Account
          </Typography>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab
                sx={{ flexDirection: "row" }}
                icon={
                  <Icon
                    style={{
                      display: "inline-flex",
                      marginBottom: "0px",
                      marginRight: "8px",
                      width: "20px",
                      height: "20px",
                    }}
                    icon="ic:baseline-account-box"
                  />
                }
                label="Thông tin chung"
                value="1"
              />
              <Tab
                sx={{ flexDirection: "row" }}
                icon={
                  <Icon
                    style={{
                      display: "inline-flex",
                      marginBottom: "0px",
                      marginRight: "8px",
                      width: "20px",
                      height: "20px",
                    }}
                    icon="el:key"
                  />
                }
                label="Đổi mật khẩu"
                value="2"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Info />
          </TabPanel>
          <TabPanel value="2">
            <ChangePassword />
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}
