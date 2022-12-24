import {
  Accordion,
  AccordionSummary,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import React, { useState } from "react";
import CustomDialog from "../../../../components/CustomDialog/CustomDialog";
import ModalDialog from "../../../../components/ModalDialog/DialogTitle";
import formatDate from "../../../../utils/formatDate";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import moment from "moment";

export default function ModalBooking({ ticket, open, handleClose }) {
  console.log("ticket", ticket);
  let currentDay = moment().format("YYYY-MM-DDTHH:mm:SS");

  const getIdSeat = (danhSachGhe) => {
    return danhSachGhe
      ?.reduce((listSeat, seat) => {
        return [...listSeat, seat.name];
      }, [])
      .join(", ");
  };
  return (
    <CustomDialog
      open={open}
      handleClose={handleClose}
      dialogSize="xs"
      overlayStyle={{ backgroundColor: "transparent" }}
    >
      {/* <ModalDialog onClose={handleClose}>

      </ModalDialog> */}
      {/* <DialogContent sx={{ backgroundColor: "#FDF2F8" }} c>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ backgroundColor: "#FDF2F8" }}
        >

        </DialogContentText>
      </DialogContent> */}
      <div className="p-3">
        <div className="bg-pink-100 rounded-xl relative">
          <div
            className="absolute bg-white h-7 w-7 rounded-full z-10 border-r-2"
            style={{
              top: "97%",
              left: "-13px",
              borderColor: "rgba(229, 231, 235,1)",
            }}
          ></div>
          <div
            className="absolute bg-white h-7 w-7 rounded-full z-10 border-l-2"
            style={{
              top: "97%",
              right: "-13px",
              borderColor: "rgba(229, 231, 235,1)",
            }}
          ></div>
          <div
            className="absolute w-full border-dashed border-t-2 mt-2"
            style={{
              top: "98.5%",
            }}
          ></div>
          <div className="w-full flex justify-start items-center  p-3">
            <div className="p-1  bg-white ">
              <img
                className="h-10 w-10 select-none rounded-sm flex-shrink-0 "
                src={ticket?.idShowtime.idTheaterSystem.logo}
                alt=""
              />
            </div>
            <div className="w-full max-w-md flex flex-col justify-center items-start ml-2">
              <div className="w-full font-semibold text-gray-500 text-base">
                {ticket?.idShowtime.idTheaterCluster.name}
              </div>
              <div className="w-full font-bold text-gray-900 text-lg">
                {ticket?.idShowtime.idMovie.name}
              </div>
            </div>
          </div>
          <img
            className="w-full h-auto text-gray-500"
            src={ticket?.idShowtime.idMovie.banner}
            alt=""
          />
          <div className="p-3 text-gray-600 font-normal ">
            Thời gian:{" "}
            <span className="text-lg">
              <span className="text-pink-600 font-bold">
                {" "}
                {new Date(ticket?.idShowtime.dateShow)
                  .toLocaleTimeString([], { hour12: false })
                  .slice(0, 5)}{" "}
              </span>
              -{" "}
              <span className="text-gray-900 font-bold">
                {formatDate(ticket?.idShowtime.dateShow).dayToday}
              </span>
              ,{" "}
              <span className="text-gray-900 font-bold">
                {formatDate(ticket?.idShowtime?.dateShow).dDMmYy}
              </span>{" "}
            </span>
          </div>
        </div>

        <div className="border rounded-xl relative">
          {moment(ticket?.idShowtime.dateShow).format("YYYY-MM-DDTHH:mm:SS") <
            currentDay && (
            <img
              className="absolute w-52 h-52"
              src="./img/ticket-not-exist.svg"
              alt=""
              style={{ left: "25%", top: "-7%" }}
            />
          )}

          <div className="p-3 ">
            <div className="flex justify-between">
              <div className="text-base">
                <div className="text-gray-400 font-medium">Phòng chiếu: </div>
                <div>{ticket?.idShowtime.idTheater.name}</div>
              </div>
              <div className="text-base">
                <div className="text-gray-400 font-medium">Số vé: </div>
                <div>0{ticket?.seatList.length}</div>
              </div>
              <div className="text-base">
                <div className="text-gray-400 font-medium">Số ghế: </div>
                <div> {getIdSeat(ticket?.seatList)}</div>
              </div>
            </div>
            <div className="w-full  border-t-2 my-2"></div>
            <div>
              <div className="text-base">
                <div className="text-gray-400 font-medium">Rạp chiếu: </div>
              </div>
              <div className="text-base font-bold py-1">
                {ticket?.idShowtime.idTheaterCluster.name}
              </div>
              <div className="text-base">
                {" "}
                {ticket?.idShowtime.idTheaterCluster.address}
              </div>
            </div>
          </div>
          <div className="bg-gray-100 w-full">
            <div className="flex justify-between">
              <div className="px-3 py-1 pt-3 text-gray-500 font-normal">
                Tổng tiền:
              </div>
              <div className="px-3 py-1 pt-3 text-2xl font-bold">
                {ticket?.totalPrice.toLocaleString("vi-VI")}đ
              </div>
            </div>
            <div className="flex justify-between">
              <div className="px-3 py-1  text-gray-500 font-normal">
                Mã giao dịch:
              </div>
              <div className="px-3 py-1 text-blue-600">{ticket?.id}</div>
            </div>
            <div className="flex justify-between">
              <div className="px-3 py-1 text-gray-500 font-normal">
                Thời gian giao dịch:
              </div>
              <div className="px-3 py-1 text-gray-500 font-normal">
                {new Date(ticket?.idShowtime.dateShow)
                  .toLocaleTimeString([], { hour12: false })
                  .slice(0, 5)}{" "}
                - {formatDate(ticket?.idShowtime?.dateShow).dDMmYy}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Accordion
            sx={{
              borderRadius: "0.75rem",
              borderWidth: "1px",
              "&.Mui-expanded": {
                borderColor: "rgb(165 0 100/1) !important",
                borderWidth: "1.5px",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography sx={{ fontWeight: "bold" }}>
                Thông tin người nhận
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="text-gray-500">
                <div className="border-t-2 border-b-2 p-2.5 flex justify-between ">
                  {" "}
                  <div className="">Họ và tên</div>
                  <div className="uppercase font-medium">
                    {ticket?.userId.fullName}
                  </div>
                </div>
                <div className="border-b-2 p-2.5 flex justify-between">
                  {" "}
                  <div className="">Số điện thoại</div>
                  <div className="font-medium">
                    {ticket?.userId.phoneNumber}
                  </div>
                </div>
                <div className="border-b-2 p-2.5 flex justify-between">
                  {" "}
                  <div className="">Email</div>
                  <div className="font-medium">{ticket?.userId.email}</div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </CustomDialog>
  );
}
