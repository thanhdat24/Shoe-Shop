import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import formatDate, { calculateTimeout } from "../../../utils/formatDate";
import useStyles from "./style";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import { postCreateTicket } from "../../../redux/actions/BookTicket";
import { SET_READY_PAYMENT } from "../../../redux/constants/BookTicket";
import { blue } from "@mui/material/colors";
import parse from "html-react-parser";
import ModalDialog from "../../../components/ModalDialog/DialogTitle";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { updateDiscount } from "../../../redux/actions/Discount";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useSnackbar } from "notistack";
import { CopyToClipboard } from "react-copy-to-clipboard";
import moment from "moment";
import Paypal from "./paypal";
import paymentApi from "../../../api/paymentApi";
import { paymentMoMo } from "../../../redux/actions/Payment";
import MoMo from "./momo";

const makeObjError = (name, value, dataSubmit) => {
  // kiểm tra và set lỗi rỗng
  let newErrors = {
    ...dataSubmit.errors,
    [name]:
      value?.trim() === ""
        ? `${name.charAt(0).toUpperCase() + name.slice(1)} không được bỏ trống`
        : "",
  };

  //   // kiểm tra và set lỗi sai định dạng
  //eslint-disable-next-line
  const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  //eslint-disable-next-line
  const regexNumber =
    /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/;
  if (name === "email" && value) {
    if (!regexEmail.test(value)) {
      newErrors[name] = "Email không đúng định dạng";
    }
  }
  if (name === "phone" && value) {
    if (!regexNumber.test(value)) {
      newErrors[name] = "Phone không đúng định dạng";
    }
  }
  return newErrors;
};

export default function PayMent(props) {
  const {
    listSeat,
    amount,
    email,
    phone,
    paymentMethod,
    isReadyPayment,
    discount,
    seatCodes,
    danhSachPhongVe: { data },
    idShowtime,
    miniPrice,
    isSelectedSeat,
    listSeatSelected,
  } = useSelector((state) => state.BookTicketReducer);

  const {
    discountList: { data: discountList },
  } = useSelector((state) => state.DiscountReducer);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  let [discountIsChoose, setDiscountIsChoose] = React.useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const [successMoMo, setSuccessMomMo] = useState(false);
  const createPaymentMoMo = JSON.parse(
    localStorage.getItem("createPaymentMoMo")
  );

  useEffect(() => {
    if (createPaymentMoMo !== null) {
      async function queryPayment() {
        const { data } = await paymentApi.queryPaymentMoMo({
          partnerCode: createPaymentMoMo?.partnerCode,
          requestId: createPaymentMoMo?.requestId,
          orderId: createPaymentMoMo?.orderId,
          lang: "vi",
          signature: "",
        });
        console.log("data", data);
        if (data?.resultCode === 0) {
          setSuccessMomMo(true);
        }
        localStorage.setItem("queryPaymentMoMo", JSON.stringify(data));
      }
      queryPayment();
    }
  }, [createPaymentMoMo]);

  useEffect(() => {
    if (successMoMo) {
      let item = JSON.parse(localStorage.getItem("itemBooking"));
      console.log("item456", item);
      console.log("idShowtime456", item.idShowtime);
      console.log("seatCodes456", item.seatCodes);
      console.log("discount456", item.discount);
      dispatch(
        postCreateTicket({
          idShowtime: item.idShowtime,
          seatCodes: item.seatCodes,
          discount: item.discount,
        })
      );
    }
  }, [successMoMo]);
  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  const emailRef = useRef();
  const phoneRef = useRef(); // dùng useRef để dom tớ element
  let variClear = useRef(""); // dùng useRef để lưu lại giá trị setTimeout
  const [dataFocus, setDataFocus] = useState({ phone: false, email: false });
  const [dataSubmit, setdataSubmit] = useState({
    values: {
      email: email,
      phone: phone,
      paymentMethod: paymentMethod,
      discount: discount,
      miniPrice: miniPrice,
    },
    errors: {
      email: "",
      phone: "",
    },
  });
  const [coupon, setCoupon] = useState("");
  const classes = useStyles({
    isSelectedSeat,
    isReadyPayment,
    dataFocus,
    dataSubmit,
    paymentMethod,
    discount,
    miniPrice,
  });

  const onChange = (e) => {
    // khi onchange update values và validation
    let { name, value } = e.target;

    let newValues = { ...dataSubmit.values, [name]: value };
    let newErrors = makeObjError(name, value, dataSubmit);
    setdataSubmit((dataSubmit) => ({
      ...dataSubmit,
      values: newValues,
      errors: newErrors,
    }));
  };

  useEffect(() => {
    // sau 0.5s mới đẩy data lên redux để tăng hiệu năng
    clearTimeout(variClear);
    variClear.current = setTimeout(() => {
      dispatch({
        type: "SET_DATA_PAYMENT",
        payload: {
          email: dataSubmit.values.email,
          phone: dataSubmit.values.phone,
          paymentMethod: dataSubmit.values.paymentMethod,
          discount: dataSubmit.values.discount,
          miniPrice: dataSubmit.values.miniPrice,
        },
      });
      // khi không có lỗi và đủ dữ liệu thì set data sẵn sàng đặt vé và ngược lại, set activeStep = 1 nếu đủ dữ liệu và chưa đặt vé
      if (
        !dataSubmit.errors.email &&
        !dataSubmit.errors.phone &&
        dataSubmit.values.email &&
        dataSubmit.values.phone &&
        dataSubmit.values.paymentMethod &&
        isSelectedSeat
      ) {
        dispatch({
          type: SET_READY_PAYMENT,
          payload: { isReadyPayment: true },
        });
      } else {
        dispatch({
          type: SET_READY_PAYMENT,
          payload: { isReadyPayment: false },
        });
      }
    }, 500);

    if (
      dataSubmit.values.paymentMethod === "ZaloPay" ||
      dataSubmit.values.paymentMethod === "Ví Moca" ||
      dataSubmit.values.paymentMethod === "Visa, Master, JCB" ||
      dataSubmit.values.paymentMethod === "ATM nội địa"
    ) {
      let item = JSON.parse(localStorage.getItem("itemBooking"));
      let item1 = { ...item, status: false };
      console.log("item1", item1);
      localStorage.setItem("itemBooking", JSON.stringify(item1));
    }

    return () => clearTimeout(variClear.current);
  }, [dataSubmit, isSelectedSeat]);

  useEffect(() => {
    // cập nhật lại data email, phone và validation khi reload
    let emailErrors = makeObjError(emailRef.current.name, email, dataSubmit);
    let phoneErrors = makeObjError(phoneRef.current.name, phone, dataSubmit);

    if (amount === 0) {
      setdataSubmit((dataSubmit) => ({
        ...dataSubmit,
        values: {
          email: email,
          phone: phone,
          paymentMethod: paymentMethod,
          discount: discount,
          miniPrice: miniPrice,
        },
        errors: { email: emailErrors.email, phone: phoneErrors.phone },
      }));
    } else {
      setdataSubmit((dataSubmit) => ({
        ...dataSubmit,
        values: {
          email: email,
          phone: phone,
          paymentMethod: paymentMethod,
          discount: discount,
          miniPrice: miniPrice,
        },
        errors: { email: emailErrors.email, phone: phoneErrors.phone },
      }));
    }
  }, [listSeat]); // khi reload listSeat sẽ được cập nhật kèm theo, email, phone mặc định của tài khoản
  const handleBookTicket = () => {
    dispatch(postCreateTicket({ idShowtime, seatCodes, discount }));
  };
  const handleRemoveDiscount = (item, index) => {
    const { price } = item;
    setDiscountIsChoose("");
    let newValues = {
      ...dataSubmit.values,
      discount: 0,
      miniPrice: 0,
    };
    let newErrors = makeObjError(discount, price, dataSubmit);
    setdataSubmit((dataSubmit) => ({
      ...dataSubmit,
      values: newValues,
      errors: newErrors,
    }));
    setOpen(false);
  };

  const handleDiscount = (item, index) => {
    let { id, price, miniPrice, code } = item;
    discountIsChoose = index;
    setDiscountIsChoose(discountIsChoose);
    if (discountIsChoose === index) {
      setTimeout(() => {
        enqueueSnackbar(`Mã khuyến mãi "${code}" được áp dụng thành công`, {
          variant: "info",
        });
      }, 100);

      setOpen(false);
    }
    if (discountIsChoose === index) {
      if (amount >= miniPrice) {
        let newValues = {
          ...dataSubmit.values,
          discount: price,
          miniPrice: miniPrice,
        };
        let newErrors = makeObjError(discount, price, dataSubmit);
        setdataSubmit((dataSubmit) => ({
          ...dataSubmit,
          values: newValues,
          errors: newErrors,
        }));
      }
    } else {
      let newValues = {
        ...dataSubmit.values,
        discount: 0,
        miniPrice: 0,
      };
      let newErrors = makeObjError(discount, price, dataSubmit);
      setdataSubmit((dataSubmit) => ({
        ...dataSubmit,
        values: newValues,
        errors: newErrors,
      }));
    }
  };
  const onFocus = (e) => {
    setDataFocus({ ...dataFocus, [e.target.name]: true });
  };
  const onBlur = (e) => {
    setDataFocus({ ...dataFocus, [e.target.name]: false });
  };
  const handleCoupon = (event) => {
    setCoupon(event.target.value);
  };

  const handlePostCoupon = () => {
    const code = discountList.find((item) => item.code === coupon);

    if (code && amount >= code.miniPrice) {
      setDiscountIsChoose(coupon);
      code.active = true;
      dispatch(updateDiscount(code, code.id));
      setTimeout(() => {
        enqueueSnackbar(`Mã khuyến mãi "${coupon}" được áp dụng thành công`, {
          variant: "info",
        });
      }, 100);
      let newValues = {
        ...dataSubmit.values,
        discount: code.price,
        miniPrice: code.miniPrice,
      };
      let newErrors = makeObjError(discount, code.price, dataSubmit);
      setdataSubmit((dataSubmit) => ({
        ...dataSubmit,
        values: newValues,
        errors: newErrors,
      }));

      setOpen(false);
    } else {
      if (coupon.length >= 4) {
        setTimeout(() => {
          enqueueSnackbar(`Mã giảm giá "${coupon}" không hợp lệ!!`, {
            variant: "error",
          });
        }, 100);
      } else {
        setTimeout(() => {
          enqueueSnackbar(`Mã khuyến mãi không hợp lệ.`, {
            variant: "error",
          });
        }, 100);
      }
    }

    setCoupon("");
  };

  const handleCopy = () => {
    setTimeout(() => {
      enqueueSnackbar("Mã giảm giá đã được sao chép thành công", {
        variant: "success",
      });
    }, 100);
  };

  const ButtonDiscount = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    borderColor: blue[500],
    "&:hover": {
      backgroundColor: blue[700],
      borderColor: blue[500],
    },
  }));

  const DiscountInfo = styled(({ className, ...props }) => (
    <Tooltip
      PopperProps={{
        sx: {
          "& .MuiTooltip-arrow": {
            "&::before": {
              backgroundColor: "rgb(255, 255, 255)",
            },
          },
        },
      }}
      arrow
      {...props}
      classes={{ popper: className }}
    />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "white",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: "400px",
      borderRadius: "8px",
      boxShadow: "rgb(0 0 0 / 15%) 0px 1px 18px",
      fontSize: theme.typography.pxToRem(12),
      padding: "24px 0px",
      pointerEvents: "auto",
    },
  }));

  return (
    <aside className={classes.payMent}>
      <div>
        {/* tổng tiền */}
        <p className={`${classes.amount} ${classes.payMentItem}`}>
          {amount >= dataSubmit.values.miniPrice
            ? `${(amount - dataSubmit.values.discount).toLocaleString(
                "vi-VI"
              )} đ`
            : `${amount.toLocaleString("vi-VI")} đ`}
          {/* {`${(amount - dataSubmit.values.discount).toLocaleString("vi-VI")} đ`} */}
        </p>

        {/* thông tin phim và rạp */}

        <div className={classes.payMentItem}>
          <p className={classes.tenPhim}>{data?.movieName}</p>
          <p>{data?.theaterClusterName}</p>
          <p>{`${data?.movieId && formatDate(data?.dateShow).dayToday} ${
            formatDate(data?.dateShow).dDMmYy
          } - ${calculateTimeout(data?.dateShow)} - ${data?.theaterName}`}</p>
        </div>

        {/* ghế đã chọn */}
        <div className={`${classes.seatInfo} ${classes.payMentItem}`}>
          <span>{`Ghế ${listSeatSelected?.join(", ")}`}</span>
          <p className={classes.amountLittle}>
            {`${amount.toLocaleString("vi-VI")} đ`}
          </p>
        </div>

        {/* email */}
        <div className={classes.payMentItem}>
          <label className={classes.labelEmail}>E-Mail</label>
          <input
            type="text"
            name="email"
            ref={emailRef}
            onFocus={onFocus}
            onBlur={onBlur}
            value={dataSubmit.values.email}
            className={classes.fillInEmail}
            onChange={onChange}
            autoComplete="off"
          />
          <p className={classes.error}>{dataSubmit.errors.email}</p>
        </div>

        {/* phone */}
        <div className={classes.payMentItem}>
          <label className={classes.labelPhone}>Phone</label>
          <input
            type="number"
            name="phone"
            ref={phoneRef}
            onFocus={onFocus}
            onBlur={onBlur}
            value={dataSubmit.values.phone}
            className={classes.fillInPhone}
            onChange={onChange}
            autoComplete="off"
          />
          <p className={classes.error}>{dataSubmit.errors.phone}</p>
        </div>

        {/* Mã giảm giá */}
        {/* <div className={classes.payMentItem}>
          <label className={classes.label}>Mã giảm giá</label>
          <input
            type="text"
            value="Tạm thời không hỗ trợ..."
            readOnly
            className={classes.fillIn}
          />
          <button className={classes.btnDiscount} disabled>
            Áp dụng
          </button>
        </div> */}

        {/* Mã giảm giá test Voucher*/}

        <div className={classes.payMentItem}>
          <label className={classes.label}>Mã giảm giá</label>
          {(discountIsChoose > 0 || discountIsChoose !== "") &&
            amount >= dataSubmit.values.miniPrice && (
              <div className="flex flex-wrap mt-2">
                <div className="overflow-hidden">
                  <div
                    style={{
                      border: "1px solid rgb(13, 92, 182)",
                      borderRadius: " 4px",
                      height: "24px",
                      backgroundColor: "rgb(230, 238, 247)",
                    }}
                  >
                    <i
                      style={{
                        float: "left",
                        marginLeft: "-6px",
                        marginTop: "6px",
                        width: "10px",
                        height: "10px",
                        border: "1px solid rgb(13, 92, 182)",
                        borderRadius: " 50%",
                        backgroundColor: "rgb(255, 255, 255)",
                      }}
                    ></i>
                    <i
                      style={{
                        float: "right",
                        marginRight: "-6px",
                        marginTop: "6px",
                        width: "10px",
                        height: "10px",
                        border: "1px solid rgb(13, 92, 182)",
                        borderRadius: " 50%",
                        backgroundColor: "rgb(255, 255, 255)",
                      }}
                      // className="float-right mt-1 -ml-1"
                    ></i>
                    <div
                      style={{ color: "rgb(13, 92, 182)" }}
                      className="py-0 px-3 items-center flex h-full  text-sm leading-5 font-normal"
                    >
                      ĐÃ GIẢM{" "}
                      {(dataSubmit.values.discount * 1).toLocaleString("vi-VI")}
                      Đ
                    </div>
                  </div>
                </div>
              </div>
            )}

          <div
            className="flex align-center cursor-pointer leading-6 mt-2"
            style={{ color: "rgb(11, 116, 229)" }}
            onClick={handleClickOpen}
          >
            <img
              className="mr-2"
              src="../img/discount/discount.svg"
              alt="logo_discount"
            />
            <span>Chọn hoặc nhập Giảm giá khác</span>
          </div>
        </div>

        {/* hình thức thanh toán */}
        <div className={classes.selectedPayMentMethod}>
          <label className={classes.label}>Hình thức thanh toán</label>
          <p className={classes.toggleNotice}>
            Vui lòng chọn ghế để hiển thị phương thức thanh toán phù hợp.
          </p>

          <div className={classes.formPayment}>
            <div className={classes.formPaymentItem}>
              <input
                className={classes.input}
                type="radio"
                name="paymentMethod"
                value="ZaloPay"
                onChange={onChange}
                checked={dataSubmit.values.paymentMethod === "ZaloPay"}
              />
              <img
                className={classes.img}
                src="/img/bookticket/zalo.jpg"
                alt="zalopay"
              />
              <label>Thanh toán qua ZaloPay</label>
            </div>
            <div className={classes.formPaymentItem}>
              <input
                className={classes.input}
                type="radio"
                name="paymentMethod"
                value="Ví Moca"
                onChange={onChange}
                checked={dataSubmit.values.paymentMethod === "Ví Moca"}
              />
              <img
                className={classes.img}
                src="/img/bookticket/moca.jpg"
                alt="cuahang"
              />
              <label>Thanh toán qua Ví Moca</label>
            </div>
            <div className={classes.formPaymentItem}>
              <input
                className={classes.input}
                type="radio"
                name="paymentMethod"
                value="Visa, Master, JCB"
                onChange={onChange}
                checked={
                  dataSubmit.values.paymentMethod === "Visa, Master, JCB"
                }
              />
              <img
                className={classes.img}
                src="/img/bookticket/visa.png"
                alt="visa"
              />
              <label>Visa, Master, JCB</label>
            </div>
            <div className={classes.formPaymentItem}>
              <input
                className={classes.input}
                type="radio"
                name="paymentMethod"
                value="ATM nội địa"
                onChange={onChange}
                checked={dataSubmit.values.paymentMethod === "ATM nội địa"}
              />
              <img
                className={classes.img}
                src="/img/bookticket/atm.png"
                alt="atm"
              />
              <label>Thẻ ATM nội địa</label>
            </div>

            {/* <div className={classes.formPaymentItem}>
              <input
                className={classes.input}
                type="radio"
                name="paymentMethod"
                value="Cửa hàng tiện ích"
                onChange={onChange}
                checked={
                  dataSubmit.values.paymentMethod === "Cửa hàng tiện ích"
                }
              />
              <img
                className={classes.img}
                src="/img/bookticket/cuahang.png"
                alt="cuahang"
              />
              <label>Thanh toán tại cửa hàng tiện ích</label>
            </div> */}

            {/* PAYPAL  */}
            <div className={classes.formPaymentItem}>
              <input
                className={classes.input}
                type="radio"
                name="paymentMethod"
                value="PayPal"
                onChange={onChange}
                checked={dataSubmit.values.paymentMethod === "PayPal"}
              />
              <img
                className={classes.img}
                src="/img/bookticket/paypal.jpg"
                alt="cuahang"
              />
              <label>Thanh toán qua PayPal</label>
            </div>

            {/* PAYPAL  */}
            <div className={classes.formPaymentItem}>
              <input
                className={classes.input}
                type="radio"
                name="paymentMethod"
                value="Ví MoMo"
                onChange={onChange}
                checked={dataSubmit.values.paymentMethod === "Ví MoMo"}
              />
              <img
                className={classes.img}
                src="/img/bookticket/momo.png"
                alt="momo"
              />
              <label>Thanh toán bằng ví MoMo</label>
            </div>
          </div>
        </div>

        {/* notice */}
        <div className={classes.notice}>
          <img
            className={classes.imgNotice}
            src="/img/bookticket/exclamation.png"
            alt="notice"
          />
          <span>Vé đã mua không thể đổi hoặc hoàn tiền</span>
          <p>
            Mã vé sẽ được gửi qua tin nhắn{" "}
            <span className={classes.contactColor}>ZMS</span> (tin nhắn Zalo) và{" "}
            <span className={classes.contactColor}>Email</span> đã nhập.
          </p>
        </div>

        {/* đặt vé */}
        {paymentMethod === "PayPal" || paymentMethod === "Ví MoMo" ? (
          paymentMethod === "Ví MoMo" ? (
            <div className="flex justify-center">
              <MoMo
                idShowtime={idShowtime}
                amount={amount}
                successMoMo={successMoMo}
              />
            </div>
          ) : (
            <div className={`${classes.formPaymentPayPal} `}>
              <div className={classes.bottomSection}>
                <div className="fixed bottom-11 right-0 w-1/4 h-4">
                  <Paypal />
                </div>
              </div>
            </div>
          )
        ) : (
          <div className={classes.bottomSection}>
            <button
              className={classes.btnDatVe}
              disabled={!isReadyPayment}
              onClick={handleBookTicket}
            >
              <p className={classes.txtDatVe}>Đặt Vé</p>
            </button>
          </div>
        )}

        {/* <div className={classes.bottomSection}>
          <button
            className={classes.btnDatVe}
            disabled={!isReadyPayment}
            onClick={handleBookTicket}
          >
            <p className={classes.txtDatVe}>Đặt Vé</p>
          </button>
        </div> */}
      </div>

      <Dialog onClose={handleClose} open={open} maxWidth="md">
        <ModalDialog onClose={handleClose}>Khuyến Mãi</ModalDialog>
        <div
          className="p-3 my-0 mx-8 flex mb-3 rounded"
          style={{ background: " rgb(242, 242, 242)" }}
        >
          <div
            style={{
              width: "calc(100% - 97px)",
              display: "inline-block",
              verticalAlign: "top",
              marginRight: " 8px",
              position: "relative",
            }}
          >
            <img
              className="absolute top-3 left-3"
              src="../img/discount/coupon-icon.svg"
              alt=""
            />
            <input
              className={classes.search}
              type="text"
              onChange={(event) => handleCoupon(event)}
              value={coupon}
              placeholder="Nhập mã giảm giá"
              style={{
                borderRadius: "4px",
                boxShadow: "none",
                border: "1px solid rgb(196, 196, 207)",
                height: " 40px",
                width: "100%",
                color: "rgb(36, 36, 36)",
                fontSize: "14px",
                lineHeight: "20px",
                padding: "14px 12px 10px 44px",
                outline: " 0px",
              }}
            />
          </div>
          {coupon.length > 0 ? (
            <ButtonDiscount
              className="ml-auto inline-flex justify-center align-top text-xs py-0 px-2"
              onClick={handlePostCoupon}
              variant="outlined"
            >
              Áp Dụng
            </ButtonDiscount>
          ) : (
            <ButtonDiscount
              className="ml-auto inline-flex justify-center align-top text-xs py-0 px-2 opacity-50 pointer-events-none"
              onClick={handlePostCoupon}
              variant="outlined"
            >
              Áp Dụng
            </ButtonDiscount>
          )}
        </div>
        <DialogContent dividers>
          <div className="flex justify-between items-center px-2">
            <Typography className="mb-2" gutterBottom>
              Mã Giảm Giá
            </Typography>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "300",
                lineHeight: " 16px",
                color: "rgb(128, 128, 137)",
              }}
            >
              Áp dụng tối đa: 1
            </div>
          </div>
          {discountList
            ?.filter(
              (itemFilter) =>
                itemFilter.activeCode === "Đang diễn ra" &&
                itemFilter.activePublic
            )
            .map((item, index) =>
              amount >= item.miniPrice ? (
                <div
                  className="grid  gap-4 truncate py-1 px-2 max-h-80"
                  key={index}
                >
                  <div className="relative">
                    <div className="relative w-full z-10 flex">
                      <div className="relative opacity-100 h-36">
                        {discountIsChoose !== index &&
                        discountIsChoose !== item.code ? (
                          <img
                            className="w-full h-36"
                            src="../img/discount/ticket_box.svg"
                            alt=""
                            style={{
                              filter:
                                "drop-shadow(rgba(0, 0, 0, 0.15) 0px 1px 3px)",
                            }}
                          />
                        ) : (
                          <img
                            className="w-full h-36"
                            src="../img/discount/ticket_box_active.svg"
                            alt=""
                            style={{
                              filter:
                                "drop-shadow(rgba(0, 0, 0, 0.15) 0px 1px 3px)",
                            }}
                          />
                        )}

                        <div className="flex absolute top-0 left-0 w-full h-full">
                          <div className="flex flex-col items-center w-52 h-32 p-2 self-center justify-center">
                            <div className="relative w-14 h-14">
                              <div className="w-full relative">
                                <img
                                  src="../img/discount/vourcher.png"
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
                            <button className="absolute top-3 right-3 translate-x-2 -translate-y-2 p-2 block bg-transparent">
                              <DiscountInfo
                                title={
                                  <React.Fragment>
                                    <div
                                      className="pr-4 flex items-center"
                                      style={{
                                        backgroundColor: "rgb(250, 250, 250)",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "50%",
                                          minWidth: "110px",
                                          flex: "0 0 auto",
                                          padding: "12px 24px",
                                          fontSize: "13px",
                                          lineHeight: "20px",
                                          color: "rgb(120, 120, 120)",
                                        }}
                                      >
                                        Mã
                                      </div>
                                      <div className="pr-2 overflow-hidden">
                                        {item.code}
                                      </div>
                                      <CopyToClipboard
                                        text={item.code}
                                        onCopy={handleCopy}
                                      >
                                        <img
                                          className="cursor-pointer"
                                          src="../img/discount/copy-icon.svg"
                                          alt="copy-icon"
                                        />
                                      </CopyToClipboard>
                                    </div>
                                    <div className="pr-4 flex items-center">
                                      <div
                                        style={{
                                          width: "50%%",
                                          minWidth: "110px",
                                          flex: "0 0 auto",
                                          padding: "12px 24px",
                                          fontSize: "13px",
                                          lineHeight: "20px",
                                          color: "rgb(120, 120, 120)",
                                        }}
                                      >
                                        Hạn sử dụng
                                      </div>
                                      <div className="pr-2 overflow-hidden">
                                        {moment(item?.expiryDate).format(
                                          "DD/MM/YY"
                                        )}
                                      </div>
                                    </div>
                                    <div
                                      className=""
                                      style={{
                                        backgroundColor: " rgb(250, 250, 250)",
                                        display: "flex",
                                        flexFlow: "row wrap",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "50%",
                                          minWidth: " 35px",
                                          flex: "0 0 auto",
                                          padding: "12px 24px",
                                          fontSize: "13px",
                                          lineHeight: "20px",
                                          color: "rgb(120, 120, 120)",
                                        }}
                                      >
                                        Điều kiện
                                      </div>
                                      <div
                                        className="description"
                                        style={{
                                          padding: "12px 24px",
                                          fontSize: "13px",
                                          lineHeight: " 20px",
                                          color: "rgb(36, 36, 36)",
                                        }}
                                      >
                                        <ul className={classes.description}>
                                          {/* {parse(item.description)} */}
                                        </ul>
                                      </div>
                                    </div>
                                  </React.Fragment>
                                }
                              >
                                <img
                                  className="m-w-full"
                                  src="../img/discount/info_active.svg"
                                  alt=""
                                />
                              </DiscountInfo>
                            </button>
                            <div className="pr-7">
                              <h4 className="text-lg font-medium leading-6 m-0 p-0 text-gray-900 max-h-6">
                                Giảm {item?.price / 1000}K
                              </h4>
                              <p className="text-sm font-normal leading-5 m-0 p-0 text-gray-500 max-h-5">
                                Cho đơn hàng từ {item.miniPrice / 1000}K
                              </p>
                            </div>
                            <div className="flex items-end mt-auto">
                              <p className="pr-7 text-sm font-normal leading-5 m-0 p-0 text-gray-500 max-h-5">
                                HSD:{" "}
                                {moment(item?.expiryDate).format("DD/MM/YY")}
                              </p>
                              {discountIsChoose !== index &&
                              discountIsChoose !== item.code ? (
                                <ButtonDiscount
                                  className="ml-auto"
                                  onClick={(e) => handleDiscount(item, index)}
                                  variant="outlined"
                                  // color="primary"
                                >
                                  Áp Dụng
                                </ButtonDiscount>
                              ) : (
                                <ButtonDiscount
                                  className="ml-auto"
                                  variant="outlined"
                                  onClick={(e) =>
                                    handleRemoveDiscount(item, index)
                                  }
                                >
                                  Bỏ Chọn
                                </ButtonDiscount>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="grid  gap-4 truncate py-1 px-2 max-h-80"
                  key={index}
                >
                  <div className="relative">
                    <div className="relative w-full z-10 flex">
                      <div className="relative opacity-100 h-36">
                        <img
                          className="w-full h-36"
                          src="../img/discount/ticket_box.svg"
                          alt=""
                          style={{
                            filter:
                              "drop-shadow(rgba(0, 0, 0, 0.15) 0px 1px 3px)",
                          }}
                        />
                        <div className="flex absolute top-0 left-0 w-full h-full">
                          <img
                            className="absolute h-16 w-20 bottom-1 right-1 max-w-full"
                            src="../img/discount/not_eligible_stamp.svg"
                            alt=""
                          />
                          <div className="flex flex-col items-center w-52 h-32 p-2 self-center justify-center">
                            <div className="relative w-14 h-14">
                              <div
                                className="w-full relative"
                                style={{ paddingBottom: "calc(100%)" }}
                              >
                                <img
                                  src="../img/discount/vourcher.png"
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
                            <button className="absolute top-3 right-3 translate-x-2 -translate-y-2 p-2 block bg-transparent">
                              <DiscountInfo
                                title={
                                  <React.Fragment>
                                    <div
                                      className="pr-4 flex items-center"
                                      style={{
                                        backgroundColor: "rgb(250, 250, 250)",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "33%",
                                          minWidth: "110px",
                                          flex: "0 0 auto",
                                          padding: "12px 24px",
                                          fontSize: "13px",
                                          lineHeight: "20px",
                                          color: "rgb(120, 120, 120)",
                                        }}
                                      >
                                        Mã
                                      </div>
                                      <div className="pr-2 overflow-hidden">
                                        {item.code}
                                      </div>
                                      <CopyToClipboard
                                        text={item.code}
                                        onCopy={handleCopy}
                                      >
                                        <img
                                          className="cursor-pointer"
                                          src="../img/discount/copy-icon.svg"
                                          alt="copy-icon"
                                        />
                                      </CopyToClipboard>
                                    </div>
                                    <div className="pr-4 flex items-center">
                                      <div
                                        style={{
                                          width: "50%%",
                                          minWidth: "110px",
                                          flex: "0 0 auto",
                                          padding: "12px 24px",
                                          fontSize: "13px",
                                          lineHeight: "20px",
                                          color: "rgb(120, 120, 120)",
                                        }}
                                      >
                                        Hạn sử dụng
                                      </div>
                                      <div className="pr-2 overflow-hidden">
                                        {moment(item?.expiryDate).format(
                                          "DD/MM/YY"
                                        )}
                                      </div>
                                    </div>
                                    <div
                                      className=""
                                      style={{
                                        backgroundColor: " rgb(250, 250, 250)",
                                        display: "flex",
                                        flexFlow: "row wrap",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "50%",
                                          minWidth: " 35px",
                                          flex: "0 0 auto",
                                          padding: "12px 24px",
                                          fontSize: "13px",
                                          lineHeight: "20px",
                                          color: "rgb(120, 120, 120)",
                                        }}
                                      >
                                        Điều kiện
                                      </div>
                                      <div
                                        className="description"
                                        style={{
                                          padding: "12px 24px",
                                          fontSize: "13px",
                                          lineHeight: " 20px",
                                          color: "rgb(36, 36, 36)",
                                        }}
                                      >
                                        <ul className={classes.description}>
                                          {/* {parse(item.description)} */}
                                        </ul>
                                      </div>
                                    </div>
                                  </React.Fragment>
                                }
                              >
                                <img
                                  className="m-w-full"
                                  src="../img/discount/info.svg"
                                  alt=""
                                />
                              </DiscountInfo>
                            </button>
                            <div className="pr-7 ">
                              <h4 className="text-lg font-medium leading-6 m-0 p-0 text-gray-900 max-h-6">
                                Giảm {item?.price / 1000}K
                              </h4>
                              <p className="text-sm font-normal leading-5 m-0 p-0 text-gray-500 max-h-5">
                                Cho đơn hàng từ {item.miniPrice / 1000}K
                              </p>
                            </div>
                            <div className="flex items-end mt-auto">
                              <p className="pr-7 text-sm font-normal leading-5 m-0 p-0 text-gray-500 max-h-5">
                                HSD:{" "}
                                {moment(item?.expiryDate).format("DD/MM/YY")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
        </DialogContent>
      </Dialog>
    </aside>
  );
}
