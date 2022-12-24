import { Card, Grid, Typography } from "@mui/material";
import "chartjs-adapter-moment";
import React, { useState } from "react";
import { Bar, Line } from "react-chartjs-2";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";
import moment from "moment";
import formatDate from "../../utils/formatDate";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export default function AppDay() {
  const {
    dayRevenue: { data },
  } = useSelector((state) => state.BookTicketReducer);
  console.log("data", data);
  const currentDate = moment();
  const weekStart = currentDate.clone().startOf("day");
  const filterValueLabel = [];
  data?.map((item) => {
    const totalTicket = item.ticketRevenue?.reduce((total, ticket) => {
      return total + ticket.totalPrice;
    }, 0);
    filterValueLabel.push({
      x: formatDate(item.name).dayToday,
      y: totalTicket,
    });
  });
  console.log("filterValueLabel", filterValueLabel);

  const filterWeekLabel = [];
  data?.map((item) => {
    const totalTicket = item.ticketRevenue?.reduce((total, ticket) => {
      return total + ticket.totalPrice;
    }, 0);
    filterWeekLabel.push({
      x: moment(item.name).format("DD/MM"),
      y: totalTicket,
    });
  });
  console.log("filterWeekLabel", filterWeekLabel);

  const dayLabel = [];
  const weekLabel = [];

  for (let i = -7; i < 1; i++) {
    dayLabel.push(
      formatDate(moment(weekStart).add(i, "days").format("MM-DD-YYYY")).dayToday
    );
  }

  for (let i = -30; i < 1; i++) {
    weekLabel.push(moment(weekStart).add(i, "days").format("DD/MM"));
  }

  console.log("dayLabel", dayLabel);
  console.log("weekLabel", weekLabel);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const [dataMovie, setDataMovie] = useState("Tất cả");

  const handleChange = (e) => {
    setDataMovie(e.target.value);
    console.log("e.target.value", e.target.value);
  };

  const soldMovie = [];
  data?.map((item) => soldMovie.push(item?.ticketRevenue.length));

  const totalSoldTicket = soldMovie?.reduce((total, ticket) => {
    return total + ticket;
  }, 0);

  const ticketRevenue = [];

  for (let i = 0; i < data?.length; i++) {
    const totalTicket = data[i].ticketRevenue?.reduce((total, ticket) => {
      return total + ticket.totalPrice;
    }, 0);

    ticketRevenue.push(totalTicket);
  }

  console.log("ticketRevenue", ticketRevenue);

  const totalTicketRevenue = ticketRevenue?.reduce((total, ticket) => {
    return total + ticket;
  }, 0);

  const optionsDay = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "THỐNG KÊ DOANH THU THEO THÁNG",
        font: {
          size: 25,
        },
        padding: 25,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const values = filterWeekLabel;

  const dataDay = {
    labels: weekLabel,
    datasets: [
      {
        data: values,
        label: "Doanh thu",
        fill: "false",
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgb(53, 162, 235)",
        stack: "Stack 1",
      },
    ],
  };
  return (
    <Card sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={9} container direction="column">
          <Bar options={optionsDay} data={dataDay} />
        </Grid>
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          xs={3}
        >
          <Grid item xs sx={{ marginTop: 7 }}>
            <Item>
              <Typography variant="h4" component="h2">
                DOANH THU
              </Typography>
              <Typography variant="h5" component="h2">
                {totalTicketRevenue.toLocaleString("vi-VI")} VNĐ
              </Typography>
            </Item>
          </Grid>
          <Grid item xs={3}>
            <Item
              className="border-solid border-b-2 border-orange-700"
              sx={{ width: 250, borderRadius: 0 }}
            ></Item>
          </Grid>
          {/* <div className="border-solid border-t-2 border-orange-700 w-full"></div> */}
          <Grid item xs>
            <Item>
              <Typography variant="h4" component="h2">
                SỐ VÉ BÁN ĐƯỢC
              </Typography>
              <Typography variant="h5" component="h2">
                {totalSoldTicket} Vé
              </Typography>
            </Item>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
