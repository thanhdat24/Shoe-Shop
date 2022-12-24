import React from "react";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import WeekendIcon from "@mui/icons-material/Weekend";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { useStyles, ColorlibConnector } from "./style";
import {
  Avatar,
  AvatarGroup,
  Box,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  tooltipClasses,
} from "@mui/material";

export default function StepCheckout() {
  const history = useHistory();
  const classes = useStyles();
  const activeStep = useSelector((state) => state.BookTicketReducer.activeStep);
  const userListBooking = useSelector(
    (state) => state.UserManagement.userListBooking
  );
  const { currentUser } = useSelector((state) => state.AuthReducer);
  const steps = ["CHỌN GHẾ", "THANH TOÁN", "KẾT QUẢ ĐẶT VÉ"];

  function StepIcon(props) {
    // console.log("userListBooking", userListBooking);
    const { active, completed } = props;
    const icons = {
      1: <WeekendIcon />,
      2: <PaymentIcon />,
      3: <CheckCircleIcon />,
    };
    return (
      <div
        className={clsx(classes.stepIcon, {
          [classes.stepIconActive]: active,
          [classes.stepIconCompleted]: completed,
        })}
      >
        {icons[String(props.icon)]}
      </div>
    );
  }
  const handleUser = () => {
    history.push("/profile");
  };

  const AvatarTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  return (
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        className={classes.stepper}
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              classes={{ label: classes.label }}
              StepIconComponent={StepIcon}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box
        sx={{
          cursor: "pointer",
          textAlign: "center",
          textTransform: "uppercase",
          // flex: "0 0 150px",
        }}
      >
        <AvatarGroup max={4} sx={{ justifyContent: "center" }}>
          {userListBooking?.map((user) => (
            <AvatarTooltip title="Người dùng ẩn danh">
              <Avatar alt={user?.fullName} src={user?.avatar} />
            </AvatarTooltip>
          ))}
        </AvatarGroup>
        <p className={classes.hoTen} style={{ marginTop: "14px" }}>
          Người dùng đặt vé
        </p>
      </Box>
      <div className={classes.account} onClick={handleUser}>
        <img
          src={currentUser.user.photo}
          alt="avatar"
          className={classes.avatar}
        />
        <p className={classes.hoTen}>{currentUser.user.fullName}</p>
      </div>
    </div>
  );
}

// ColorlibConnector: đường gạch ngang nối giữa các bước
// activeStep: xác định step hiện tại
// StepIconComponent: node làm icon đại diện, mặc định nhận vào boolean active, completed, error và number: icon để css tương ứng
