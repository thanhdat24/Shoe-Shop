const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const Product = require('../models/productModel');
const ProductDetail = require('../models/productDetailModel');
const ProductImages = require('../models/productImagesModel');
const Promotion = require('../models/promotionModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const _ = require('lodash');
const moment = require('moment');
const nodemailer = require('nodemailer');
const formatDate = require('../utils/formatDate');

require('dotenv').config();

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_APP, // generated ethereal user
    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
  },
});

exports.getAllOrder = factory.getAll(Order, { path: 'orderDetail' });
exports.getMeOrder = catchAsync(async (req, res, next) => {
  let query = Order.find(req.query).populate('orderDetail');
  const doc = await query;
  let filterDoc = doc.filter((item) => item.idUser.id === req.user.id);

  filterDoc.sort((a, b) => b.createdAt - a.createdAt);

  res.status(200).json({
    status: 'success',
    length: filterDoc.length,
    data: filterDoc,
  });
});
exports.getDetailOrder = factory.getOne(Order, { path: 'orderDetail' });

const filterObj = (obj, ...allowedField) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedField.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.createOrder = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  console.log('req.user', req.user);
  try {
    req.body.idUser = _id;
    const objOrder = filterObj(
      req.body,
      'address',
      'total',
      'paymentMethod',
      'idUser',
      'shipper',
      'idPromotion',
      'status'
    );
    const order = await Order.create(objOrder);
    req.order = order;

    console.log('req.order', req.order);
    let arrayItems = [];
    if (req.order.idPromotion !== null) {
      const promotion = await Promotion.find(req.order.idPromotion);
      console.log('promotion', promotion);
      req.promotion = promotion;
    }
    let totalQuality = 0;
    console.log('req.body.cart', req.body.cart);
    if (order._id) {
      await req.body.cart.map(async (item, index) => {
        let product = await Product.findById(item.productId);
        if (product) {
          if (order.paymentMethod.resultCode == 1006) {
            let itemProduct = {
              quantity: item.quantity,
              price: product.price,
              total: item.quantity * product.price,
              idColor: item.idColor,
              idSize: item.idSize,
              idOrder: order._id,
              idProduct: product._id,
              productImage: item.cover,
            };
            arrayItems.push(itemProduct);
          } else {
            totalQuality += item.quantity;
            product.soldQuality += totalQuality;
            await product.save();

            let idColorAndSize = await ProductDetail.find({
              idColor: item.idColor,
              idSize: item.idSize,
            });
            if (idColorAndSize) {
              idColorAndSize[0].quantity -= item.quantity;

              await idColorAndSize[0].save();
            } else {
              return next(new AppError('Không tồn tại quyển sách nào!', 404));
            }

            let itemProduct = {
              quantity: item.quantity,
              price: product.price,
              total: item.quantity * product.price,
              idColor: item.idColor,
              idSize: item.idSize,
              idOrder: order._id,
              idProduct: product._id,
              productImage: item.cover,
            };
            arrayItems.push(itemProduct);
          }
        } else {
          return next(new AppError('Không tồn tại sản phảm nào!', 404));
        }
        if (arrayItems.length === req.body.cart.length) {
          await OrderDetail.insertMany(arrayItems);
          const { address, total, _id, paymentMethod, createdAt, status } =
            req.order;
          console.log('status', status);
          if (status !== 'Đã hủy') {
            let dayFull = formatDate(createdAt).dateFull;

            req.promotion =
              req.promotion !== undefined ? req.promotion[0].price : 0;
            console.log('abc123', total - req.promotion);
            await transporter.sendMail({
              from: `"Thông báo xác nhận đơn hàng #${_id}" <ltdat.ctu@gmail.com>`, // sender address
              to: `${address.email}`, // list of receivers
              subject: 'EMAIL XÁC NHẬN ĐẶT HÀNG THÀNH CÔNG', // Subject line
              // text: "Hello world?", // plain text body
              html: `
            <div marginwidth="0" marginheight="0" style="padding:0">
		<div id="m_-2654664080331285438wrapper" dir="ltr" style="background-color:#f7f7f7;margin:0;padding:70px 0;width:100%" bgcolor="#f7f7f7" width="100%">
			<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">
<tbody><tr>
<td align="center" valign="top">
						<div id="m_-2654664080331285438template_header_image">
													</div>
						<table border="0" cellpadding="0" cellspacing="0" width="720" id="m_-2654664080331285438template_container" style="background-color:#fff;border:1px solid #dedede;border-radius:3px" bgcolor="#fff">
<tbody><tr>
<td align="center" valign="top">
									
									<table border="0" cellpadding="0" cellspacing="0" width="100%" id="m_-2654664080331285438template_header" style="background-color:#96588a;color:#fff;border-bottom:0;font-weight:bold;line-height:100%;vertical-align:middle;font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif;border-radius:3px 3px 0 0" bgcolor="#96588a"><tbody><tr>
<td id="m_-2654664080331285438header_wrapper" style="padding:36px 48px;display:block">
												<h1 style="font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif;font-size:30px;font-weight:300;line-height:150%;margin:0;text-align:left;color:#fff;background-color:inherit" bgcolor="inherit">Cảm ơn đã mua <span class="il">hàng</span> của chúng tôi</h1>
											</td>
										</tr></tbody></table>

</td>
							</tr>
<tr>
<td align="center" valign="top">
									
									<table border="0" cellpadding="0" cellspacing="0" width="720" id="m_-2654664080331285438template_body"><tbody><tr>
<td valign="top" id="m_-2654664080331285438body_content" style="background-color:#fff" bgcolor="#fff">
												
												<table border="0" cellpadding="20" cellspacing="0" width="100%"><tbody><tr>
<td valign="top" style="padding:48px 48px 32px">
															<div id="m_-2654664080331285438body_content_inner" style="color:#636363;font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif;font-size:14px;line-height:150%;text-align:left" align="left">

<p style="margin:0 0 16px">Xin chào ${address.fullName},</p>
<p style="margin:0 0 16px">Chúng tôi đã nhận được đặt hàng của bạn và đã sẵn sàng để vận chuyển. Chúng tôi sẽ thông báo cho bạn khi đơn hàng được gửi đi.</p>
<p style="margin:0 0 16px">${paymentMethod.name}</span>.</p>


<h2 style="color:#96588a;display:block;font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left">
	[<span class="il">Đơn</span> <span class="il">hàng</span> #${_id}] (${dayFull})</h2>

<div style="margin-bottom:40px">
	<table cellspacing="0" cellpadding="6" border="1" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;width:100%;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif" width="100%">
<thead><tr>
<th scope="col" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left" align="left">Sản phẩm</th>
				<th scope="col" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left" align="left">Đơn giá</th>
        <th scope="col" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left" align="left">Số lượng</th>
				<th scope="col" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left" align="left">Thành tiền</th>
			</tr></thead>
<tbody>

 ${req.body.cart
   .map((item, index) =>
     `
   <tr key=${index}>
              <td style="color:#636363;border:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:middle;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;word-wrap:break-word" align="left">
              <div>
              <p>${item.name}</p>
              <p>Phân lại hàng: ${item.colorName}, ${item.size}</p>
              </div>
              
              </td>
              		<td style="color:#636363;border:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:middle;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif" align="left">
		${item.price.toLocaleString()}	</td>
		<td style="color:#636363;border:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:middle;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif" align="left">
		${item.quantity}	</td>
		<td style="color:#636363;border:1px solid #e5e5e5;padding:12px;text-align:left;vertical-align:middle;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif" align="left">
			<span>${(
        item.quantity * item.price
      ).toLocaleString()}&nbsp;<span>₫</span></span>		</td></tr>
              `.trim()
   )
   .join('')}
  </tbody>
<tfoot>
<tr>
<th scope="row" colspan="2" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left;border-top-width:4px" align="left">Tổng số phụ:</th>
						<td scope="row" colspan="2" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left;border-top-width:4px" align="left"><span>${(
              total + req.promotion
            ).toLocaleString()} &nbsp;<span>₫</span></span></td>
					</tr>
<tr>
<th scope="row" colspan="2" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left;border-top-width:4px" align="left">Khuyến mãi:</th>
						<td scope="row" colspan="2" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left;border-top-width:4px" align="left"><span>${req.promotion.toLocaleString()} &nbsp;<span>₫</span></span></td>
					</tr>

<tr>
<th scope="row" colspan="2" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left" align="left">Giao nhận <span class="il">hàng</span>:</th>
						<td scope="row" colspan="2" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left" align="left">Giao <span class="il">hàng</span> miễn phí</td>
					</tr>
<tr>
<th scope="row" colspan="2" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left" align="left">Phương thức thanh toán:</th>
						<td scope="row" colspan="2" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left" align="left">${
              paymentMethod.name
            }</span></td>
					</tr>
<tr>
<th scope="row" colspan="2" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left" align="left">Tổng cộng:</th>
						<td scope="row" colspan="2" style="color:#636363;border:1px solid #e5e5e5;vertical-align:middle;padding:12px;text-align:left" align="left"><span>${total.toLocaleString()}&nbsp;<span>₫</span></span></td>
					</tr>
</tfoot>
</table>
</div>

<table id="m_-2654664080331285438addresses" cellspacing="0" cellpadding="0" border="0" style="width:100%;vertical-align:top;margin-bottom:40px;padding:0" width="100%"><tbody><tr>
<td valign="top" width="50%" style="text-align:left;font-family:'Helvetica Neue',Helvetica,Roboto,Arial,sans-serif;border:0;padding:0" align="left">
			<h2 style="color:#96588a;display:block;font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif;font-size:18px;font-weight:bold;line-height:130%;margin:0 0 18px;text-align:left">Địa chỉ giao hàng</h2>

			<address style="padding:12px;color:#636363;border:1px solid #e5e5e5; font-size: 15px">
				${address.fullName}
        <br><a href="tel:${
          address.phoneNumber
        }" style="color:#96588a;font-weight:normal;text-decoration:underline" target="_blank">${
                address.phoneNumber
              }</a>
        <br>Số nhà : ${address.fullAddress}</address>
		</td>
			</tr></tbody></table>
<p style="margin:0 0 16px">Cảm ơn đã mua <span class="il">hàng</span> của chúng tôi.</p>
															</div>
														</td>
													</tr></tbody></table>

</td>
										</tr></tbody></table>

</td>
							</tr>
</tbody></table>
</td>
				</tr>
<tr>
<td align="center" valign="top">
						
						<table border="0" cellpadding="10" cellspacing="0" width="600" id="m_-2654664080331285438template_footer"><tbody><tr>
<td valign="top" style="padding:0;border-radius:6px">
									<table border="0" cellpadding="10" cellspacing="0" width="100%"><tbody><tr>
<td colspan="2" valign="middle" id="m_-2654664080331285438credit" style="border-radius:6px;border:0;color:#8a8a8a;font-family:&quot;Helvetica Neue&quot;,Helvetica,Roboto,Arial,sans-serif;font-size:12px;line-height:150%;text-align:center;padding:24px 0" align="center">
											<p style="margin:0;color:#999;line-height:150%;font-size:14px">Nếu bạn có bất cứ câu hỏi nào, đừng ngần ngại liên lạc với chúng tôi tại <a href="mailto:thanhledatomon@gmail.com" style="font-size:14px;text-decoration:none;color:#1666a2" target="_blank">thanhledatomon@gmail.com</a></p>
											</td>
										</tr></tbody></table>
</td>
							</tr></tbody></table>

</td>
				</tr>
</tbody></table><div class="yj6qo"></div><div class="adL">
</div></div><div class="adL">
	</div></div>
             `,
            });
          }
        }
      });

      res.status(201).json({
        status: 'success',
        result: order.length,
        data: order,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  console.log('req.body.status', req.body.status);
  const _id = req.params.id;
  const options = { new: true, runValidators: true };
  if (req.body.status === 'Đã hủy') {
    let doc = await Order.findByIdAndUpdate(_id, req.body, options);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    const orderDetail = await OrderDetail.find({ idOrder: _id });
    if (orderDetail) {
      await orderDetail.map(async (item) => {
        let idColorAndSize = await ProductDetail.find({
          idColor: item.idColor,
          idSize: item.idSize,
        });
        if (idColorAndSize) {
          idColorAndSize[0].quantity += item.quantity;

          await idColorAndSize[0].save();
        }
      });
    }

    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: doc,
    });
  } else if (req.body.status === 'Đã giao hàng') {
    const doc = await Order.findByIdAndUpdate(_id, req.body, options);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: doc,
    });
  } else if (req.body.status === 'Đã nhận') {
    console.log('req.body.status', req.body.status);
    const doc = await Order.findByIdAndUpdate(
      _id,
      {
        $set: {
          'paymentMethod.resultCode': 0,
          'paymentMethod.message': 'Thành công.',
          status: req.body.status,
        },
      },
      options
    );
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: doc,
    });
  } else {
    const doc = await Order.findByIdAndUpdate(_id, req.body, options);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: doc,
    });
  }
});

exports.monthlyProductRevenue = catchAsync(async (req, res, next) => {
  // let a = { status: 'Đã nhận' };
  let idProduct = req.params.id;
  let doc = await OrderDetail.find({ idProduct });

  doc = doc.filter(
    (item) =>
      item.idOrder.status === 'Đã nhận' || item.idOrder.status === 'Đã đánh giá'
  );
  let result = _(doc)
    .groupBy((x) => moment(x.createdAt).format('DD-MM-YYYY'))
    .map((value, key) => ({ nameYear: key, orderRevenueDay: value }))
    .value();

  let array = _(result)
    .groupBy((x) => moment(x.orderRevenueDay[0].createdAt).format('MM-YYYY'))
    .map((value, key) => ({
      name: key,
      orderRevenueMonth: value,
    }))
    .value();

  // lấy ra tháng hiện tại để filter
  const currentDate = moment();
  const formattedDate = currentDate.format('MM-YYYY');

  array = array.filter((item) => item.name === formattedDate);

  const arrayMonth = [];
  const totalQuality = [];
  const totalPrice = [];

  array.forEach((month) => {
    month.orderRevenueMonth.forEach((order) => {
      arrayMonth.push(order.nameYear);
      let quality = 0;
      let price = 0;
      order.orderRevenueDay.forEach((day) => {
        quality += day.quantity;
        price += day.idOrder.total;
      });
      totalQuality.push(quality);
      totalPrice.push(price);
    });
  });

  res.status(200).json({
    status: 'success',
    result: arrayMonth.length,
    arrayMonth,
    totalQuality,
    totalPrice,
  });
});

exports.yearlyProductRevenue = catchAsync(async (req, res, next) => {
  let idProduct = req.params.id;
  let doc = await OrderDetail.find({ idProduct });
  doc = doc.filter(
    (item) =>
      item.idOrder.status === 'Đã nhận' || item.idOrder.status === 'Đã đánh giá'
  );
  let result = _(doc)
    .groupBy((x) => moment(x.createdAt).format('MM-YYYY'))
    .map((value, key) => ({ nameYear: key, orderRevenueDay: value }))
    .value();

  let array = _(result)
    .groupBy((x) => moment(x.orderRevenueDay[0].createdAt).format('MM-YYYY'))
    .map((value, key) => ({
      // name: moment(new Date(key)).format('MM'),
      name: key,
      orderRevenueMonth: value,
    }))
    .value();

  const arrayMonth = [];
  const totalQuality = [];
  const totalPrice = [];

  array.forEach((month) => {
    month.orderRevenueMonth.forEach((order) => {
      arrayMonth.push(order.nameYear);
      let quality = 0;
      let price = 0;
      order.orderRevenueDay.forEach((day) => {
        quality += day.quantity;
        price += day.idOrder.total;
      });
      totalQuality.push(quality);
      totalPrice.push(price);
    });
  });

  res.status(200).json({
    status: 'success',
    result: arrayMonth.length,
    arrayMonth,
    totalQuality,
    totalPrice,
  });
});

exports.getNotifications = catchAsync(async (req, res, next) => {
  let doc = await Order.find({ status: 'Đang xử lý' }).sort({ createdAt: -1 });

  let filteredDoc = doc.map(
    ({ idUser, _id, total, createdAt, isRead, status }) => ({
      idUser: { displayName: idUser.displayName, photoURL: idUser.photoURL },
      _id,
      total,
      createdAt: moment(createdAt).format('HH:mm DD-MM-YY'),
      isRead,
      status,
    })
  );

  res.status(200).json({
    status: 'success',
    result: filteredDoc.slice(0, 5).length,
    data: filteredDoc.slice(0, 5),
  });
});

exports.bestSellingProductsRevenue = catchAsync(async (req, res, next) => {
  let doc = await Product.find();

  const sortedProducts = doc.sort((a, b) => b.soldQuality - a.soldQuality);
  const topThreeProducts = sortedProducts
    .filter((product) => product.soldQuality > 0)
    .slice(0, 3);

  const arrayQuality = topThreeProducts.map((product) => product.soldQuality);
  const arrayName = topThreeProducts.map((product) => product.name);

  res.status(200).json({
    status: 'success',
    arrayQuality,
    arrayName,
  });
});
