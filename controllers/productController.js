const Product = require("./../models/productModel");
const User = require("./../models/userModel");
const Store = require("./../models/storeModel");
const Brand = require("./../models/brandModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");

exports.createProduct = catchAsync(async (req, res, next) => {
  if (!req.body.store) {
    req.body.store = req.params.storeId;
  }
  if (!req.body.author) {
    req.body.author = req.user.id;
  }

  const store = await Store.findById(req.params.storeId);
  if (!store) {
    return next(new AppError("No Store Found with this Id", 404));
  }

  if (req.user.role == "owner") {
    if (store.owner != req.user.id) {
      return next(new AppError("This Is Not Your Store", 403));
    }
  }

  if (req.user.role == "admin") {
    if (!store.admin.includes(req.user.id)) {
      return next(new AppError("This Is Not Your Store", 403));
    }
  }

  const newProduct = await Product.create(req.body);
  newProduct.createSlug();
  res.status(201).json({
    status: "success",
    newProduct,
  });
});

// store/storeId/products/productId

exports.getProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { storeId } = req.params;

  const store = await Store.findById(storeId);
  if (!store) {
    return next(new AppError("Store Not Found", 404));
  }

  const product = await Product.find({ _id: productId, store: storeId });

  if (!product) {
    return next(new AppError("This Product Not Found in this Store", 404));
  }

  res.status(200).json({
    status: "success",
    product,
  });
});

// store/storeId/products

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const { storeId } = req.params;

  const store = await Store.findById(storeId);
  if (!store) {
    return next(new AppError("Store Not Found", 404));
  }

  // normal
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // when i see the gte or .... add the $
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  let query = Product.find(JSON.parse(queryStr)).find({ store: storeId });
  // console.log(JSON.parse(queryStr));

  // sorting

  if (req.query.sort) {
    const sortedBy = req.query.sort.replaceAll(",", " ");
    query = query.sort(sortedBy);
  }

  // limiting the fields

  if (req.query.fields) {
    const sortedBy = req.query.fields.replaceAll(",", " ");
    query = query.select(sortedBy);
  } else {
    query = query.select("-__v");
  }

  // pagination

  // page, limit (In one page how many products we can show), skip

  const page = req.query.page;
  const limit = req.query.limit;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const productCount = await Product.countDocuments();
    if (skip >= productCount) {
      return next(new AppError("No Products Found", 404));
    }
  }

  // let x = await query;

  const products = await query;

  res.status(200).json({
    status: "success",
    productLength: products.length,
    products,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new AppError("Product Not Found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  if (!req.body.store) {
    req.body.store = req.params.storeId;
  }
  if (!req.body.author) {
    req.body.author = req.user.id;
  }

  const store = await Store.findById(req.params.storeId);
  if (!store) {
    return next(new AppError("No Store Found with this Id", 404));
  }

  if (req.user.role == "owner") {
    if (store.owner != req.user.id) {
      return next(new AppError("This Is Not Your Store", 403));
    }
  }

  if (req.user.role == "admin") {
    if (!store.admin.includes(req.user.id)) {
      return next(new AppError("This Is Not Your Store", 403));
    }
  }

  const deletedProduct = await Product.findOneAndDelete({
    _id: req.params.productId,
    store: req.body.store,
  });
  if (!deletedProduct) {
    return next(new AppError("Product Not Found in this Store", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  if (!req.body.store) {
    req.body.store = req.params.storeId;
  }
  if (!req.body.author) {
    req.body.author = req.user.id;
  }

  const store = await Store.findById(req.params.storeId);
  if (!store) {
    return next(new AppError("No Store Found with this Id", 404));
  }

  if (req.user.role == "owner") {
    if (store.owner != req.user.id) {
      return next(new AppError("This Is Not Your Store", 403));
    }
  }

  if (req.user.role == "admin") {
    if (!store.admin.includes(req.user.id)) {
      return next(new AppError("This Is Not Your Store", 403));
    }
  }

  const updateProduct = await Product.findByIdAndUpdate(
    { _id: req.params.productId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateProduct) {
    return next(new AppError("Product Not Found in this Store", 404));
  }

  res.status(200).json({
    status: "success",
    updateProduct,
  });
});

exports.getAllProductsForBrand = catchAsync(async (req, res, next) => {
  const { brandId } = req.params;
  const brand = await Brand.findById(brandId);
  if (!brand) {
    return next(new AppError("Brand doesnt found", 404));
  }
  const products = await Product.find({ brand: brandId });
  res.status(200).json({
    status: "success",
    products,
  });
});

exports.addToWishList = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { prodId } = req.body;

  const user = await User.findById(_id);
  if (!user) {
    return next(new AppError("User Not Found With this ID", 404));
  }
  if (user.wishlist.includes(prodId)) {
    return next(new AppError("Product Already Added to Your WishList", 400));
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      $push: { wishlist: prodId },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({
    status: "sucess",
    updatedUser,
  });
});

exports.rating = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { start, prodId } = req.body;
});


exports.uploadImages = catchAsync(async(req,res,next)=>{

  console.log(req.files);




})