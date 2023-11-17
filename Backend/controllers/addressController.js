const factory = require('../controllers/handlerFactory');
const Address = require('../models/addressModel');
const catchAsync = require('../utils/catchAsync');

exports.getDetailAddress = factory.getOne(Address);
exports.updateAddress = factory.updateOne(Address);
exports.deleteAddress = factory.deleteOne(Address);
exports.getAllAddress = factory.getAll(Address);

exports.createAddress = catchAsync(async (req, res, next) => {
  const fullAddress = `{{$trigger.address}}, {{$trigger.ward.name}}, {{$trigger.district.name}}, {{$trigger.city.name}}`;
  const newAddress = new Address({
    fullName: req.body.fullName,
    phoneNumber: req.body.phoneNumber,
    city: req.body.city.name,
    district: req.body.district.name,
    ward: req.body.ward.name,
    addressType: req.body.addressType,
    address: req.body.address,
    idUser: req.user._id,
    email: req.user.email,
    fullAddress,
  });
  newAddress.save();
  let query = await Address.find(req.query).populate('idUser');
  let filterDoc = query.filter((item) => item.idUser.id === req.user._id);
  if (filterDoc) {
    for (let i = 0; i <= filterDoc.length - 1; i++) {
      await Address.findByIdAndUpdate(filterDoc[i]._id, {
        isDefault: 'false',
      });
    }
  }

  // const doc = await Address.create(req.body);

  res.status(201).json({
    status: 'success',
    result: newAddress.length,
    data: newAddress,
  });
});

exports.getMeAddress = catchAsync(async (req, res, next) => {
  let query = Address.find(req.query).populate('idUser');
  const doc = await query;
  let filterDoc = doc.filter((item) => item.idUser.id === req.user.id);

  filterDoc.sort((a, b) => b.createdAt - a.createdAt);
  for (let i = 1; i <= filterDoc.length - 1; i++) {
    await Address.findByIdAndUpdate(
      filterDoc[i]._id,
      { isDefault: false },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  res.status(200).json({
    status: 'success',
    length: filterDoc.length,
    data: filterDoc,
  });
});
