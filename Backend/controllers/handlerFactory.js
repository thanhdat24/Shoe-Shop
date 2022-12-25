const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('../utils/cloudinary');


exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(201).json({
      status: 'success',
      data: 'Xóa thành công!',
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.body.photo) {
      const uploadedResponse = await cloudinary.uploader.upload(
        req.body.photo,
        {
          upload_preset: 'image_movie',
        }
      );
      req.body.photo = uploadedResponse.secure_url;
    }
    if (req.body.banner) {
      const uploadedResponse = await cloudinary.uploader.upload(
        req.body.banner,
        {
          upload_preset: 'image_movie',
        }
      );
      req.body.banner = uploadedResponse.secure_url;
    }
    const _id = req.params.id;
    const doc = await Model.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: doc,
    });
  });


exports.createOne = (Model, uploadCloudName, imageModelName, bannerModelName) =>
  catchAsync(async (req, res, next) => {
    if (imageModelName && imageModelName === 'photo') {
      if (req.body.photo) {
        const uploadedResponse = await cloudinary.uploader.upload(
          req.body.photo,
          {
            upload_preset: uploadCloudName,
          }
        );
        req.body.photo = uploadedResponse.secure_url;
      }
    }

    if (bannerModelName && bannerModelName === 'banner') {
      if (req.body.banner) {
        const uploadedResponse = await cloudinary.uploader.upload(
          req.body.banner,
          {
            upload_preset: uploadCloudName,
          }
        );
        req.body.banner = uploadedResponse.secure_url;
      }
    }

    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      result: doc.length,
      data: doc,
    });
  });


exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      length: 1,
      data: doc,
    });
  });

exports.getAll = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    // let filter = {};
    // if (req.params.tourId) filter = { tour: req.params.tourId };

    // const features = new APIFeatures(Model.find(filter), req.query)
    //   .filter()
    //   .sort()
    //   .limitFields()
    //   .paginate();
    // const doc = await features.query;

    let query = Model.find(req.query);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: doc,
    });
  });
