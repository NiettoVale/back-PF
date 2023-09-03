const { Product } = require("../../DataBase");

const getProductsById = async (req, res) => {
  try {
    const { id } = req.params;
    const productsFound = await Product.findOne({
      where: {
        id,
      },
    });
    if (!productsFound) {
      return res.status(400).json({ error: "Producto no encontrado" });
    }
    return res.status(200).json(productsFound);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = getProductsById;
