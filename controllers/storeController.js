const Store = require("./../models/storeModel");
const User = require("./../models/userModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");

exports.createStore = catchAsync(async (req, res, next) => {
  const store = await Store.create(req.body);
  res.status(200).json({
    status: "sucess",
    store,
  });
});

// superVisor

exports.deleteStore = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const store = await Store.findByIdAndDelete(id);
  if (!store) {
    return next(new AppError("No Store Found!", 404));
  }

  res.status(204).json({
    status: "sucess",
    data: null,
  });
});

exports.updateStore = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  const store = await Store.findById(req.params.id);

  if (!store) {
    return next(new AppError("No Store Found", 404));
  }

  if (user.role === "owner") {
    if (store.owner == user.id) {
      if (req.body.name) {
        return next(
          new AppError(
            "SuperVisor or bigAdmin Only Can Change the Store Name",
            403
          )
        );
      }
      const updatedStore = await Store.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).json({
        status: "sucess",
        updatedStore,
      });
    }
  }
  const updatedStore = await Store.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "sucess",
    updatedStore,
  });
});

exports.deleteStore = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  const store = await Store.findById(req.params.id);

  if (!store) {
    return next(new AppError("No Store Found", 404));
  }

  if (user.role === "owner") {
    if (store.owner == user.id) {
      if (store.isdisable === true) {
        return next(new AppError("The Store already disabled", 404));
      }
      await Store.findByIdAndUpdate(
        req.params.id,
        { isdisable: true },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(204).json({
        status: "sucess",
        data: null,
      });
    }
  }
  await Store.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "sucess",
    data: null,
  });
});

exports.getStore = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const store = await Store.findById(id).populate('products');
  if (!store) {
    return next(new AppError("No Store Found!", 404));
  }
  store.numViews += 1;
  await store.save();

  // const page = req.query.page;
  // const limit = req.query.limit;
  // const skip = (page - 1) * limit;
  // query = query.skip(skip).limit(limit);


  res.status(200).json({
    status: "sucess",
    store,
  });
});

exports.getAllStores = catchAsync(async (req, res, next) => {
  const stores = await Store.find();
  if (stores.length === 0) {
    return next(new AppError("No Stores Found!", 404));
  }
  res.status(200).json({
    status: "sucess",
    numOfStores: stores.length,
    stores,
  });
});
