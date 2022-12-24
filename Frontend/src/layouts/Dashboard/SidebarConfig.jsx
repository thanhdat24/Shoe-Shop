import { Icon } from "@iconify/react";
import peopleFill from "@iconify/icons-eva/people-fill";

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;
const getImage = (src) => <img src={src} alt="iconImage" />;

const sidebarConfig = [
  {
    title: "Trang quản lý",
    path: "/admin/dashboard",
    icon: getIcon("eva:pie-chart-2-fill"),
  },
  {
    title: "Quản lý người dùng",
    path: ["/admin/users/list", "/admin/users/account"],
    icon: getIcon(peopleFill),
    children: [
      {
        title: "List",
        path: "/admin/users/list",
        icon: getIcon("ci:dot-02-s"),
      },
      {
        title: "Account",
        path: "/admin/users/account",
        icon: getIcon("ci:dot-02-s"),
      },
    ],
  },
  {
    title: "Quản lý phim",
    path: ["/admin/movies/list", "/admin/movies/create"],
    children: [
      {
        title: "List",
        path: "/admin/movies/list",
        icon: getIcon("ci:dot-02-s"),
      },
      {
        title: "Create",
        path: "/admin/movies/create",
        icon: getIcon("ci:dot-02-s"),
      },
    ],
    icon: getIcon("bx:bxs-movie-play"),
  },
  {
    title: "Quản lý rạp",
    path: ["/admin/theater/list", "/admin/theater/create"],
    children: [
      {
        title: "List",
        path: "/admin/theater/list",
        icon: getIcon("ci:dot-02-s"),
      },
      {
        title: "Create",
        path: "/admin/theater/create",
        icon: getIcon("ci:dot-02-s"),
      },
    ],
    icon: getIcon("ic:baseline-theaters"),
  },
  {
    title: "Quản lý cụm rạp",
    path: ["/admin/theater-cluster/list", "/admin/theater-cluster/create"],
    children: [
      {
        title: "List",
        path: "/admin/theater-cluster/list",
        icon: getIcon("ci:dot-02-s"),
      },
      {
        title: "Create",
        path: "/admin/theater-cluster/create",
        icon: getIcon("ci:dot-02-s"),
      },
    ],
    icon: getIcon("ic:baseline-theaters"),
  },
  {
    title: "Quản lý lịch chiếu phim",
    path: ["/admin/showtimes/list", "/admin/showtimes/create"],
    children: [
      {
        title: "List",
        path: "/admin/showtimes/list",
        icon: getIcon("ci:dot-02-s"),
      },
      {
        title: "Create",
        path: "/admin/showtimes/create",
        icon: getIcon("ci:dot-02-s"),
      },
    ],
    icon: getIcon("map:movie-theater"),
  },
  {
    title: "Quản lý vé",
    path: "/admin/ticket/list",
    icon: getIcon("ep:ticket"),
  },
  {
    title: "Quản lý đánh giá",
    path: "/admin/review/list",
    icon: getIcon("bi:star-fill"),
  },
  {
    title: "Quản lý khuyến mãi",
    path: ["/admin/discount/list", "/admin/discount/create"],
    icon: getImage("../../../img/admin/discount/icon-coupon.svg"),
    children: [
      {
        title: "List",
        path: "/admin/discount/list",
        icon: getIcon("ci:dot-02-s"),
      },
      {
        title: "Create",
        path: "/admin/discount/create",
        icon: getIcon("ci:dot-02-s"),
      },
    ],
  },
];

export default sidebarConfig;
