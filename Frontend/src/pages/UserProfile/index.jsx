import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import Info from "./AccountInfo/Info";
import ChangePassword from "./AccountInfo/ChangePassword";
import BookingHistory from "./BookingHistory/BookingHistory";
import {
  getCurrentUser,
  getDetailUser,
  resetUpdate,
} from "../../redux/actions/Auth";

export default function UserProfile() {
  
  const {
    currentUser: { user },
  } = useSelector((state) => state.AuthReducer);
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser());
    return () => dispatch(resetUpdate());
  }, []);

  return (
    <div className="bg-gray-100 flex flex-col items-center z-10">
      <div className="bg-white shadow">
        <div className="relative mb-6 select-none">
          <img src="./img/tix-banner.png" alt="banner" />
          <div className="absolute h-28 w-28 rounded-full left-1/2 transform bottom-0 translate-y-5 -translate-x-1/2 border-4 border-white dark:border-dark-secondary ring-4 ring-green-400 dark:ring-green-500 cursor-pointer">
            <div className="relative flex-shrink-0 w-full h-full">
              <img
                className="h-full w-full select-none bg-white rounded-full object-cover flex-shrink-0 filter hover:brightness-110"
                src={user.photo}
                alt="banner"
              />
            </div>
          </div>
        </div>
        <div className="w-full pb-6 max-w-screen-lg mx-auto z-10">
          <div className="text-center font-bold text-3xl py-2">
            {user.fullName}
          </div>
          <div className="max-w-11/12 mx-auto text-center max-row-3 text-sm"></div>
        </div>
      </div>
      {/* <div> */}
        <div className="w-full flex self-end justify-end mt-1 mb-3 max-w-screen-lg mx-auto">
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
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
                    label="Thông Tin tài khoản"
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
                        icon="clarity:shield-check-solid"
                      />
                    }
                    label="Đổi mật khẩu"
                    value="2"
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
                        icon="bi:ticket-perforated-fill"
                      />
                    }
                    label="Vé của tôi"
                    value="3"
                  />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Info />
              </TabPanel>
              <TabPanel value="2">
                <ChangePassword />
              </TabPanel>
              <TabPanel
                value="3"
                sx={{
                  padding: "24px 0",
                  width: "123.8%",
                  left: " -10%",
                  position: "relative",
                }}
              >
                <BookingHistory userId={user._id} />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      {/* </div> */}
    </div>
  );
}
