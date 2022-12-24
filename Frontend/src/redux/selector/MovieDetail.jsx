import { createSelector } from "reselect";
import formatDate from "../../utils/formatDate";

// đây chỉ là function nhằm mục đích tạo ra data mới từ currentSelectedTheaterSystemList
const selectData = (currentSelectedTheaterSystemList) => {
  // lọc ra tất cả movieschedule và add thêm props tenCumRap để nhận biết movieschedule này thuộc cụm rạp nào
  const arrayAllLichChieuPhim =
    currentSelectedTheaterSystemList.theaterClusterList.reduce(
      (colect, item) => {
        return [
          ...colect,
          ...item.movieSchedule.map((lichChieu) => ({
            ...lichChieu,
            theaterClusterName: item.name,
          })),
        ];
      },
      []
    );
  // tạo mảng chỉ chứa ngày
  const arrayAllDay = arrayAllLichChieuPhim.map((item) => {
    return item.dateShow.slice(0, 10); // tạo mảng mới với item là "2020-12-17" cắt ra từ 2020-12-17T10:10:00
  });
  const arrayDay = [...new Set(arrayAllDay)].sort(); // xóa đi phần tử trùng lặp

  // [ [{},{},{}], [{},{},{}], [{},{},{}]] : array chứa dữ liệu theo ngày, array con: [{ tenCumRap, maLichChieu, movieschedule },{}]
  const allArrayCumRapChieuFilterByDay = arrayDay.map((day) => {
    // tạo mảng chứa lichchieuphim filter theo ngày
    const arrayLichChieuPhimFilterByDay = arrayAllLichChieuPhim.filter(
      (item) => {
        if (item.dateShow.slice(0, 10) === day) {
          return true;
        }
        return false;
      }
    );

    // loại bỏ cumRapChieu trùng lặp
    const arrayCumRapChieuRemoveDup = arrayLichChieuPhimFilterByDay?.filter(
      (itemIncrease, indexIncrease, arr) => {
        const indexFirstFounded = arr.findIndex(
          (t) => t.idTheaterCluster.name === itemIncrease.idTheaterCluster.name
        );
        return indexIncrease === indexFirstFounded;
      }
    );
    // tạo mảng cumRapChieu
    const arrayCumRapChieu = arrayCumRapChieuRemoveDup.map((cumRapChieu) => {
      const theaterClusterName = cumRapChieu.idTheaterCluster.name;
      const theaterClusterAddress = cumRapChieu.idTheaterCluster.address;
      const theaterClusterPhoto = cumRapChieu.idTheaterCluster.photo;
      const idShowtime = cumRapChieu._id;
      // tạo mảng movieschedule: trùng tenCumRap

      const movieschedule = arrayLichChieuPhimFilterByDay.filter(
        (movieschedule) =>
          movieschedule.idTheaterCluster.name === theaterClusterName
      );
      return {
        theaterClusterName,
        idShowtime,
        movieschedule,
        theaterClusterAddress,
        theaterClusterPhoto,
      };
    });

    return arrayCumRapChieu;
  });

  return { arrayDay, allArrayCumRapChieuFilterByDay };
};

const selectCommentByMaPhimAndCommentTest = createSelector(
  (state, movieId) =>
    state.ReviewReducer.commentList?.filter(
      (item) => item.movieId.id === movieId
    ), // nếu comment là dataTest hoặc trùng mã phim thì lấy
  (commentListFiltered) => {
    console.log("commentListFiltered", commentListFiltered);

    const commentList = commentListFiltered?.sort(
      (a, b) =>
        formatDate(b.createdAt).getTime - formatDate(a.createdAt).getTime
    );
    return { commentList };
  }
);

export { selectData, selectCommentByMaPhimAndCommentTest };
