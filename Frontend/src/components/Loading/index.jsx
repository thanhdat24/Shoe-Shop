/*
- isLazy: khi Suspense(trong App) return về component thì isLazy = true, khi Suspense unmount component thì isLazy = false,
    do boolean isLazy toggle quá nhanh nên dùng useHandleVibrateLazy để hạn chế reloading loading nhiều lần
- có 3 kiểu biến dùng để hiện loading: 1 là isLazy(component đó lần đầu loading), 2 là call api trong component, 3 là isLoadingBackToHome > do quá trình render homepage rất lâu.
- dùng useRef để lưu lại giá trị trước đó của loading, khi loading thay đổi ta biết được loading chuyển trạng thái từ true > false hay ngược lại từ đó kiểm soát hiệu ứng:
    các biến kiểm soát hiệu ứng:
              loadingStart    loadingCompleted
    visible   true            delay 600ms > false
    fadein    true            false
    fadeout   false           true
- muốn kích hoạt lại một keyframes phải đổi giá trị key(khai niệm trong react), hoặc move class chứa keyframes ra và thêm vào lại
- mỗi lần quay về home vì mất một thời gian mới return component(mặc dù đã tải sẵn code + data) > để tạo loading thì:
  + khi click thì dispatch isLoadingBackToHome là true trong reducer Lazy để kích hoạt loading
  + bên trong component page > Homepage > Carousel kích hoạt loading xong nếu component render xong
- do cùng một element không thể có 2 animation cùng lúc lên phải tách ra thành 2 div, 1 div shake, một div fade
- khi fadeOut kết thúc thì cần ẩn đi loadding > bắt sự kiện animationend, sau đó xóa addEventListener để không bắt animationend của fadeIn

*/
import React, { useEffect, useRef, useState, useCallback } from "react";

import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { useSelector } from "react-redux";
import useHandleVibrateLazy from "../../utils/useHandleVibrateLazy";
import { IMG_LOADING } from "../../constants/config";

const useStyles = makeStyles({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: (props) => (props.effectFadeOut ? "transparent" : "#fff"),
    zIndex: -1,
    transition: "background-color 0.6s ease-in-out",

    width: "100vw",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
  },
  visible: {
    zIndex: 99999,
  },
  image: {
    width: 140,
    animation: "$shake 0.6s infinite",
    position: "relative",
  },
  fadeIn: {
    animationName: "$fadeIn",
    animationDuration: "0.6s",
  },
  fadeOut: {
    animationName: "$fadeOut",
    animationDuration: "0.6s",
  },
  "@keyframes shake": {
    "0%": { transform: "rotate(-10deg)" },
    "50%": { transform: "rotate(10deg)" },
    "100%": { transform: "rotate(-10deg)" },
  },
  "@keyframes fadeIn": {
    "0%": { opacity: 0, transform: "scale(0.6,0.6)" },
    "70%": { opacity: 0.7, transform: "scale(1.1,1.1)" },
    "100%": { opacity: 1, transform: "scale(1)" },
  },
  "@keyframes fadeOut": {
    "0%": { opacity: 1, transform: "scale(1)" },
    "70%": { opacity: 0.7, transform: "scale(1.1,1.1)" },
    "100%": { opacity: 0, transform: "scale(0.6,0.6)" },
  },
});

export default function Loading() {
  const isLazy = useHandleVibrateLazy();
  const isLoadingBackToHome = useSelector(
    (state) => state.LazyReducer.isLoadingBackToHome
  );
  const loadingGetListSeat = useSelector(
    (state) => state.BookTicketReducer.loadingGetListSeat
  );
  const loadingDetailShowtime = useSelector(
    (state) => state.BookTicketReducer.loadingDetailShowtime
  );
  const loadingDetailMovie = useSelector(
    (state) => state.MovieReducer.loadingDetailMovie
  );
  const loadingGetDetailUser = useSelector(
    (state) => state.AuthReducer.loadingGetDetailUser
  );
  const loadingCurrentUserLogin = useSelector(
    (state) => state.AuthReducer.loadingCurrentUserLogin
  );
  const loadingDetailDiscount = useSelector(
    (state) => state.DiscountReducer.loadingDetailDiscount
  );
  const loading =
    isLazy ||
    loadingGetListSeat ||
    loadingDetailMovie ||
    isLoadingBackToHome ||
    loadingGetDetailUser ||
    loadingCurrentUserLogin ||
    loadingDetailDiscount ||
    loadingDetailShowtime;
  const loadingPrevious = useRef(false);

  const [controlEffect, setControlEffect] = useState({
    visible: false,
    effectFadeIn: false,
    effectFadeOut: false,
  });
  const eFadeEffect = useRef(null);
  const materialStyles = useStyles({
    loading,
    visible: controlEffect.visible,
    effectFadeOut: controlEffect.effectFadeOut,
  });

  useEffect(() => {
    // loadding chuyển từ false sang true
    if (Number(loadingPrevious.current) < Number(loading)) {
      // console.log("START: ", loadingPrevious.current, loading);
      setControlEffect((data) => ({
        ...data,
        visible: true,
        effectFadeIn: true,
        effectFadeOut: false,
      }));
      loadingPrevious.current = true;
      // loadding chuyển từ true sang false
    } else if (Number(loadingPrevious.current) > Number(loading)) {
      // console.log("END: ", loadingPrevious.current, loading);
      setControlEffect((data) => ({
        ...data,
        visible: true,
        effectFadeIn: false,
        effectFadeOut: true,
      }));
      loadingPrevious.current = false;
      // khi fadeOut kết thúc thì reset loading
      eFadeEffect.current?.addEventListener("animationend", resetAnimation);
    }
  }, [loading]);

  const resetAnimation = useCallback((e) => {
    // dùng useCallback vì removeEventListener chỉ xóa sự kiện dựa trên cùng một function
    eFadeEffect.current?.removeEventListener("animationend", resetAnimation);
    setControlEffect((data) => ({
      ...data,
      visible: false,
      effectFadeIn: false,
      effectFadeOut: false,
    }));
  }, []);

  return (
    <div
      className={clsx(
        `${materialStyles.root}`,
        controlEffect.visible && `${materialStyles.visible}`
      )}
      // khi chuyển url > component mới chưa load xong nên loading(zIndex: -1) hiện ra > cần ẩn đi lúc đó để hiệu ứng fadeIn mượt hơn
      style={{ display: controlEffect.visible ? "flex" : "none" }}
    >
      <div
        ref={eFadeEffect}
        className={clsx(
          controlEffect.effectFadeIn && `${materialStyles.fadeIn}`,
          controlEffect.effectFadeOut && `${materialStyles.fadeOut}`
        )}
      >
        {/* <div className={materialStyles.loader}></div> */}
        <img src={IMG_LOADING} className={materialStyles.image} alt="logo" />
      </div>
    </div>
  );
}
