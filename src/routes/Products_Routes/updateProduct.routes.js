const express = require("express");
const updateProduct = require("../../controllers/Products/updateProduct");
const router = express.Router();

router.get("/products", updateProduct);

module.exports = router;
