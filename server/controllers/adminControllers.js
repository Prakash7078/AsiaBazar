const expressAsyncHandler = require("express-async-handler");
const connectDB = require("../db/connectDB.js");
const { StatusCodes } = require("http-status-codes");
const uploadImage = require("../middleware/uploadMiddleware.js");

// 🔹 Add Product
const addProduct = expressAsyncHandler(async (req, res) => {
  const {
    product_name,
    product_price,
    product_quantity,
    product_category,
    quantity_measure,
    total_quantity,
    product_description,
  } = req.body;

  const imageUrls = [];
  const totalQty = req.body.total_quantity === '' ? null : parseInt(req.body.total_quantity, 10);

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      await uploadImage("asiabazar", file); // uploads to S3
      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/asiabazar/${file.originalname}`;
      imageUrls.push(imageUrl);
    }
  }

  const db = await connectDB();
  const [result] = await db.query(
    `INSERT INTO Products (product_name, product_price, product_quantity,quantity_measure,total_quantity, product_category, product_description, product_image)
     VALUES (?, ?, ?, ?, ?,?,?,?)`,
    [
      product_name,
      product_price,
      product_quantity,
      quantity_measure,
      total_quantity,
      product_category,
      product_description,
      JSON.stringify(imageUrls), // Store as stringified array
    ]
  );

  const newProduct = {
    product_id: result.insertId,
    product_name,
    product_price,
    product_quantity,
    product_category,
    product_description,
    product_image: imageUrls,
  };

  res.status(201).json({
    message: "✅ Product added successfully",
    product: newProduct,
  });
});

const deleteProduct = expressAsyncHandler(async(req,res)=>{
  const db = await connectDB();
  await db.query(`delete from Products where product_id=?`,[req.params.id])
  res.status(StatusCodes.OK).json({ message: "✅ Product deleted successfully" });

})
  


// 🔹 Update Product
const updateProduct = expressAsyncHandler(async (req, res) => {
  const {
    product_id,
    product_name,
    product_price,
    product_quantity,
    quantity_measure,
    total_quantity,
    product_category,
    product_description
  } = req.body;
  const existingImages = JSON.parse(req.body.existing_images || "[]");

  const newImageUrls = [];

  // Handle new file uploads
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      await uploadImage("asiabazar", file); // S3 upload
      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/asiabazar/${file.originalname}`;
      newImageUrls.push(imageUrl);
    }
  }

  // Merge existing and new images
  const allImages = [...existingImages, ...newImageUrls];

  // Update in database
  const db = await connectDB();
  await db.query(
    `UPDATE Products 
     SET product_name = ?, 
         product_price = ?, 
         product_quantity = ?, 
         quantity_measure = ?, 
         total_quantity = ?, 
         product_category = ?, 
         product_description= ?,
         product_image = ? 
     WHERE product_id = ?`,
    [
      product_name,
      product_price,
      product_quantity,
      quantity_measure,
      total_quantity,
      product_category,
      product_description,
      JSON.stringify(allImages),
      req.params.id,
    ]
  );

  res.status(StatusCodes.OK).json({ message: "✅ Product updated successfully" });
});
const getAllUsers = expressAsyncHandler(async (req, res) => {
  const db = await connectDB();
  const [users] = await db.query(`SELECT * FROM Users`);
  res.status(StatusCodes.OK).json(users);
});
module.exports = {
  addProduct,
  getAllUsers,
  updateProduct,
  deleteProduct
};
