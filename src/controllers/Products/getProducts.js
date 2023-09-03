const { Product, Size } = require("../../DataBase");

const getProducts = async (_req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        delete: false,
      },
      include: [
        {
          model: Size,
          as: "Sizes",
          attributes: ["name"],
        },
      ],
    });

    const formattedProducts = products.map((product) => {
      const totalStock = product.stock;
      const sizesWithStock = product.Sizes.map((size) => size.name);

      const totalSizes = sizesWithStock.length;

      const stockPerSize = Math.floor(totalStock / totalSizes);
      const remainder = totalStock % totalSizes;

      const formattedSizes = Object.fromEntries(
        sizesWithStock.map((size, index) => [
          size,
          stockPerSize + (index < remainder ? 1 : 0),
        ])
      );

      return {
        id: product.id,
        name: product.name,
        gender: product.gender,
        category: product.category,
        mainMaterial: product.mainMaterial,
        description: product.description,
        images: product.images,
        price: product.price,
        delete: product.delete,
        stock: product.stock,
        size: formattedSizes,
      };
    });

    if (formattedProducts.length > 0) {
      return res.status(200).json(formattedProducts);
    }

    return res.status(200).json({ message: "No hay productos almacenados." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getProducts;
