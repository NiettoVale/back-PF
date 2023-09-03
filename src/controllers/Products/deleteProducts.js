const { Product } = require("../../DataBase");

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Actualiza el campo 'eliminado' en lugar de eliminar físicamente
    await Product.update(
      { eliminado: true },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({ message: "Prenda eliminada." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = deleteProduct;
