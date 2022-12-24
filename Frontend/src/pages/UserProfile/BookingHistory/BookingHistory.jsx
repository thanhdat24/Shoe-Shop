import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Label from "../../../components/Label";
import { getDetailUser, resetUpdate } from "../../../redux/actions/Auth";
import formatDate, { calculateTimeout } from "../../../utils/formatDate";
import ModalBooking from "./Modal/ModalBooking";

export default function BookingHistory({ userId }) {
  const { successGetDetailUser } = useSelector((state) => state.AuthReducer);
  const dispatch = useDispatch();
  const [ticket, setTicket] = useState();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    dispatch(getDetailUser(userId));
  }, []);
  console.log("successGetDetailUser", successGetDetailUser);
  // lấy id ghế để render ra nhiều ghê
  const getIdSeat = (danhSachGhe) => {
    return danhSachGhe
      .reduce((listSeat, seat) => {
        return [...listSeat, seat.name];
      }, [])
      .join(", ");
  };
  let currentDay = moment().format("YYYY-MM-DDTHH:mm:SS");

  const handleClickTicket = (item) => {
    // console.log("item", item);
    setTicket(item);
    setOpen(true);
  };
  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-2 px-28">
        {successGetDetailUser?.bookingHistory?.map((item, index) => (
          <div className=" w-full space-x-2">
            <div
              className="grid  gap-4 truncate py-2 px-2 max-h-80"
              key={index}
            >
              <div className="relative">
                <div className="relative w-full z-10 flex justify-center">
                  <div className="relative opacity-100 h-36">
                    <img
                      className="w-full h-36 hover:bg-gray-100"
                      src="../img/discount/ticket_box.svg"
                      alt=""
                      style={{
                        filter: "drop-shadow(rgba(0, 0, 0, 0.15) 0px 1px 2px)",
                        // "&:hover": {
                        //   filter: "drop-shadow(rgba(0, 0, 0, 0.15) 0px 4px 7px)",
                        // },
                      }}
                    />

                    <div
                      className="flex absolute top-0 left-0 w-full h-full hover:shadow-box-ticket transition-shadow"
                      onClick={(e) => handleClickTicket(item)}
                    >
                      <div className="flex flex-col items-center w-52 h-32 p-2 self-center justify-center">
                        <div className="relative w-14 h-14">
                          <div className="w-full relative">
                            <img
                              src={item.idShowtime.idTheaterSystem.logo}
                              alt=""
                              className="object-contain rounded-lg"
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            margin: "4px 4px 0px",
                            textAlign: "center",
                            fontSize: "13px",
                          }}
                        >
                          <p>{item.title}</p>
                        </div>
                      </div>
                      <div className="flex flex-col p-3 w-full">
                        <button className="absolute top-3 right-3 translate-x-2 -translate-y-2 p-2 block bg-transparent"></button>
                        <div className="pr-7 transform translate-x-1">
                          <h4 className="text-lg font-bold leading-6 m-0 p-0 text-gray-900 max-h-6">
                            {item.idShowtime.idMovie.name.slice(0, 30)}...
                          </h4>
                          <p className="text-sm mt-3 leading-5 p-0 text-gray-900 font-semibold max-h-5">
                            {new Date(item.idShowtime.dateShow)
                              .toLocaleTimeString([], { hour12: false })
                              .slice(0, 5)}{" "}
                            - {formatDate(item?.idShowtime.dateShow).dayToday},{" "}
                            {formatDate(item?.idShowtime?.dateShow).dDMm}{" "}
                            <span className="w-1 h-1 inline-block transform -translate-y-full bg-gray-600 rounded-full"></span>{" "}
                            <span className="text-gray-400 text-sm font-light">
                              {item?.idShowtime.idTheaterCluster.name}
                            </span>
                            <div className="mt-4 text-xs">
                              {moment(item?.idShowtime.dateShow).format(
                                "YYYY-MM-DDTHH:mm:SS"
                              ) < currentDay ? (
                                <Label variant="ghost" color={"success"}>
                                  Đã sử dụng
                                </Label>
                              ) : (
                                <Label variant="ghost" color={"warning"}>
                                  Hạn còn{" "}
                                  {moment(item?.idShowtime?.dateShow).dates()}{" "}
                                  ngày
                                </Label>
                              )}
                            </div>
                            {/* <p className="mt-4 text-blue-600 text-xs ">
  
                            </p> */}
                          </p>
                        </div>
                        <div className="flex items-end mt-auto">
                          <p className="pr-7 text-sm font-normal leading-5 m-0 p-0 text-gray-500 max-h-5">
                            {/* HSD: {moment(item?.expiryDate).format("DD/MM/YY")} */}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ModalBooking handleClose={handleClose} open={open} ticket={ticket} />
    </>
  );
}
