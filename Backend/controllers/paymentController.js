const { Payment } = require('../models/paymentModel');
var crypto = require('crypto');
var secretKey = 'um76xDBeRmmj5kVMhXiCeFKixZTTlmZb';
var iv = new Buffer(16); // 16 byte buffer with random data
iv.fill(0); // fill with zeros
const factory = require('../controllers/handlerFactory');

exports.getAllPayment = factory.getAll(Payment);
exports.createPayment = factory.createOne(Payment);

exports.updatePayment = factory.updateOne(Payment);

function encrypt_token(data) {
  let objJsonStr = JSON.stringify(data);
  return Buffer.from(objJsonStr).toString('base64');
}

exports.createMoMoPayment = (request, response) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var partnerCode = process.env.PARTNERCODE;
  var accessKey = process.env.ACCESSKEY;
  var secretkey = process.env.SECRETKEY;
  var requestId = partnerCode + new Date().getTime();
  var orderId = requestId;
  var orderInfo = request.body.orderInfo;
  var redirectUrl = `http://localhost:3000/confirmOrder/${orderId}`;
  var ipnUrl = 'https://callback.url/notify';
  // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
  var amount = request.body.total;
  var requestType = 'captureWallet';
  var extraData = encrypt_token(request.body.extraData); //pass empty value if your merchant does not have stores

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&extraData=' +
    extraData +
    '&ipnUrl=' +
    ipnUrl +
    '&orderId=' +
    orderId +
    '&orderInfo=' +
    orderInfo +
    '&partnerCode=' +
    partnerCode +
    '&redirectUrl=' +
    redirectUrl +
    '&requestId=' +
    requestId +
    '&requestType=' +
    requestType;
  //puts raw signature
  console.log('--------------------RAW SIGNATURE----------------');
  console.log(rawSignature);
  //signature
  const crypto = require('crypto');
  var signature = crypto
    .createHmac('sha256', secretkey)
    .update(rawSignature)
    .digest('hex');
  console.log('--------------------SIGNATURE----------------');
  console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerName: 'Test',
    storeId: 'MomoTestStore',
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: 'vi',
  });
  //Create the HTTPS objects
  const https = require('https');
  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
  };
  //Send the request and get the response
  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    let result = '';
    res.on('data', (body) => {
      console.log('body', body);
      result += body;
    });
    res.on('end', () => {
      const data = JSON.parse(result);
      response.status(200).json(data);

      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  // write data to request body
  console.log('Sending....');
  req.write(requestBody);
  req.end();
};

exports.queryPayment = (request, response) => {
  //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
  //parameters
  var partnerCode = process.env.PARTNERCODE;
  var accessKey = process.env.ACCESSKEY;
  var secretkey = process.env.SECRETKEY;
  var requestId = partnerCode + new Date().getTime();
  var orderId = request.body.orderId;

  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    'accessKey=' +
    accessKey +
    '&orderId=' +
    orderId +
    '&partnerCode=' +
    partnerCode +
    '&requestId=' +
    requestId;
  //puts raw signature
  console.log('--------------------RAW SIGNATURE----------------');
  console.log(rawSignature);
  //signature
  const crypto = require('crypto');
  var signature = crypto
    .createHmac('sha256', secretkey)
    .update(rawSignature)
    .digest('hex');
  console.log('--------------------SIGNATURE----------------');
  console.log(signature);

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    requestId: requestId,
    orderId: orderId,
    signature: signature,
    lang: 'vi',
  });
  //Create the HTTPS objects
  const https = require('https');
  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/query',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
  };
  //Send the request and get the response
  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (body) => {
      console.log('body', body);
      if (body) response.status(200).json(JSON.parse(body));
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  // write data to request body
  console.log('Sending....');
  req.write(requestBody);
  req.end();
};

exports.refundMoMoPayment = (request, response) => {
  console.log('request.body', request.body);
  var partnerCode = process.env.PARTNERCODE;
  var accessKey = process.env.ACCESSKEY;
  var secretkey = process.env.SECRETKEY;
  var requestId = partnerCode + new Date().getTime();
  var date = new Date().getTime();
  var orderId = date + ':0123456778';
  var amount = request.body.amount;
  var orderInfo = 'Thanh toán qua ví MoMo';
  var lang = 'vi';
  var transId = request.body.transId;
  var description = '';
  //before sign HMAC SHA256 with format
  //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
  var rawSignature =
    'accessKey=' +
    accessKey +
    '&amount=' +
    amount +
    '&description=' +
    description +
    '&orderId=' +
    orderId +
    '&partnerCode=' +
    partnerCode +
    '&requestId=' +
    requestId +
    '&transId=' +
    transId;

  //signature
  const crypto = require('crypto');
  var signature = crypto
    .createHmac('sha256', secretkey)
    .update(rawSignature)
    .digest('hex');

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    orderId: orderId,
    requestId: requestId,
    amount: amount,
    transId: transId,
    lang: 'vi',
    description: description,
    signature: signature,
  });
  //Create the HTTPS objects
  const https = require('https');
  const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/refund',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody),
    },
  };
  //Send the request and get the response
  const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    let result = '';
    res.on('data', (body) => {
      console.log('body', body);
      result += body;
    });
    res.on('end', () => {
      const data = JSON.parse(result);
      response.status(200).json(data);

      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  // write data to request body
  console.log('Sending....');
  req.write(requestBody);
  req.end();
};
