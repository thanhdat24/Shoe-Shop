import React from 'react';

import PropTypes from 'prop-types';

import Iconify from '../Iconify';

// ----------------------------------------------------------------------

StatusOrder.propTypes = {
  status: PropTypes.string,
};

export default function StatusOrder({ status }) {
  return (
    <>
      {(status === 'Đã giao hàng' || status === 'Đã nhận' || status === 'Đã đánh giá') && (
        <>
          <Iconify icon="eva:car-outline" sx={{ color: '#16A34A', marginRight: 1, width: 24, height: 24 }} />
          <p className="text-green-600">Đơn hàng đã giao thành công</p> <span className="px-2 text-gray-300">|</span>
        </>
      )}

      {status === 'Đã hủy' && (
        <Iconify icon="eva:slash-outline" sx={{ color: '#FF4040', marginRight: 1, width: 24, height: 24 }} />
      )}

      {status === 'Đang vận chuyển' && (
        <Iconify icon="eva:clock-outline" sx={{ color: '#1890FF', marginRight: 1, width: 24, height: 24 }} />
      )}

      {status === 'Đang xử lý' && (
        <Iconify
          icon="eva:checkmark-circle-2-outline"
          sx={{ color: '#FFC107', marginRight: 1, width: 24, height: 24 }}
        />
      )}
    </>
  );
}
