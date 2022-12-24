import {
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AppTheaterCluster() {
  const {
    ticketRevenue: { data },
    movieRevenue: { dataMovie },
  } = useSelector((state) => state.BookTicketReducer);
  console.log("data", data);
  console.log("dataMovie", dataMovie);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const [dataTheaterCluster, setDataTheaterCluster] = useState("Tất cả");

  const handleChange = (e) => {
    setDataTheaterCluster(e.target.value);
    console.log("e.target.value", e.target.value);
  };

  data?.sort((a, b) => a.name.localeCompare(b.name));

  const filter = data?.filter((item) => {
    if (dataTheaterCluster === "Tất cả") return data;
    return item.name === dataTheaterCluster;
  });

  console.log("filter", filter);

  const soldTicket = [];
  filter?.map((item) => soldTicket.push(item?.ticketRevenue.length));

  const totalSoldTicket = soldTicket?.reduce((total, ticket) => {
    return total + ticket;
  }, 0);

  const ticketRevenue = [];

  for (let i = 0; i < filter?.length; i++) {
    const totalTicket = filter[i].ticketRevenue?.reduce((total, ticket) => {
      return total + ticket.totalPrice;
    }, 0);

    ticketRevenue.push(totalTicket);
  }

  const totalTicketRevenue = ticketRevenue?.reduce((total, ticket) => {
    return total + ticket;
  }, 0);

  const optionsTicket = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "THỐNG KÊ DOANH THU CẢ NĂM THEO CỤM RẠP",
        font: {
          size: 25,
        },
        padding: 25,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
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

  const dataTicket = {
    labels: filter?.map((item) => item.name),
    datasets: [
      {
        data: soldTicket,
        label: "Số vé bán được",
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgb(255, 99, 132)",
        stack: "Stack 0",
      },
      {
        data: ticketRevenue,
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
          <FormControl sx={{ width: 250 }}>
            <InputLabel id="select">Chọn Cụm Rạp</InputLabel>
            <Select
              labelId="select"
              id="select"
              label="Chọn Cụm Rạp"
              onChange={handleChange}
              value={dataTheaterCluster}
            >
              <MenuItem
                value="Tất cả"
                key="123"
                // style={{
                //   display: data.openCtr?.movie ? "none" : "block",
                // }}
              >
                Tất cả
              </MenuItem>
              {data?.map((theaterCluster) => (
                <MenuItem
                  value={theaterCluster.name} // giá trị sẽ được đẩy lên
                  key={theaterCluster._id}
                >
                  {theaterCluster.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Bar options={optionsTicket} data={dataTicket} />
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
