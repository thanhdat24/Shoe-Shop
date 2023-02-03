// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/admin';
const ROOTS = '/';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  home: ROOTS,
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
};

export const PATH_HOME = {
  search: {
    root: path(ROOTS, '/search'),
    view: (name) => path(ROOTS, `search?q=${name}`),
    viewPrice: (name, priceGte, priceLte) =>
      path(ROOTS, `search?q=${name}&price_gte=${priceGte}&price_lte=${priceLte}`),
  },
  gender: {
    root: path(ROOTS, '/gender'),
    view: (name) => path(ROOTS, `gender/?q=${name}`),
    viewPrice: (name, priceGte, priceLte) =>
      path(ROOTS, `gender/?q=${name}&price_gte=${priceGte}&price_lte=${priceLte}`),
  },
  product: {
    root: path(ROOTS, '/product'),
    view: (name) => path(ROOTS, `product/${name}`),
  },
  user: {
    root: path(ROOTS, 'account'),
    order: path(ROOTS, 'order'),
    view: (id) => path(ROOTS, `order/view/${id}`),
  },
};

export const PATH_SHIPPER = {
  shipper: {
    root: path(ROOTS, 'shipper/dashboard'),
    order: path(ROOTS, 'shipper/order'),
    view: (id) => path(ROOTS, `shipper/order/view/${id}`),
    login: path(ROOTS, 'shipper/login'),
    // view: (name) => path(ROOTS, `product/${name}`),
  },
};

export const PATH_PAGE = {
  root: '/',
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
  },
  promotion: {
    root: path(ROOTS_DASHBOARD, '/promotion'),
    list: path(ROOTS_DASHBOARD, '/promotion/list'),
    new: path(ROOTS_DASHBOARD, '/promotion/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/promotion/edit/${id}`),
  },
  color: {
    root: path(ROOTS_DASHBOARD, '/color'),
    list: path(ROOTS_DASHBOARD, '/color/list'),
    new: path(ROOTS_DASHBOARD, '/color/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/color/edit/${id}`),
  },
  size: {
    root: path(ROOTS_DASHBOARD, '/size'),
    list: path(ROOTS_DASHBOARD, '/size/list'),
    new: path(ROOTS_DASHBOARD, '/size/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/size/edit/${id}`),
  },

  shipper: {
    root: path(ROOTS_DASHBOARD, '/shipper'),
    list: path(ROOTS_DASHBOARD, '/shipper/list'),
    new: path(ROOTS_DASHBOARD, '/shipper/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/shipper/edit/${id}`),
  },

  brand: {
    root: path(ROOTS_DASHBOARD, '/brand'),
    list: path(ROOTS_DASHBOARD, '/brand/list'),
    new: path(ROOTS_DASHBOARD, '/brand/new'),
    // edit: (id) => path(ROOTS_DASHBOARD, `${id}`),
  },
  cate: {
    root: path(ROOTS_DASHBOARD, '/cate'),
    list: path(ROOTS_DASHBOARD, '/cate/list'),
    new: path(ROOTS_DASHBOARD, '/cate/new'),
    // edit: (id) => path(ROOTS_DASHBOARD, `${id}`),
  },
  objUse: {
    root: path(ROOTS_DASHBOARD, '/objUse'),
    list: path(ROOTS_DASHBOARD, '/objUse/list'),
    new: path(ROOTS_DASHBOARD, '/objUse/new'),
    // edit: (id) => path(ROOTS_DASHBOARD, `${id}`),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    // demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
