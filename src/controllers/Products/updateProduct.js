const { Product, Size } = require("../../DataBase");
const products = require("./arrayProducts");

function getRandomQuantity(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const postProduct = async (req, res) => {
  try {
    const { name, gender, category, mainMaterial, images, price, description } =
      req.body;

    const productCount = await Product.count();

    if (productCount === 0) {
      await Product.bulkCreate(products);

      const sizes = await Size.findAll();

      if (sizes && sizes.length > 0) {
        const allProducts = await Product.findAll();
        await Promise.all(
          allProducts.map(async (product) => {
            // Agregar stock directamente al producto
            await product.update({
              stock: getRandomQuantity(50, 500), // Número aleatorio entre 1 y 100
            });

            await product.addSizes(sizes);
          })
        );
      } else {
        return res
          .status(500)
          .json({ message: "No se encontraron tallas en la base de datos." });
      }

      return res
        .status(200)
        .json({ message: "Producto(s) cargado(s) exitosamente." });
    } else {
      const newProduct = await Product.create({
        name,
        gender,
        category,
        mainMaterial,
        images,
        price,
        description,
      });

      const sizes = await Size.findAll();

      if (sizes && sizes.length > 0) {
        // Agregar stock directamente al producto
        await newProduct.update({
          stock: getRandomQuantity(1, 100), // Número aleatorio entre 1 y 100
        });

        await newProduct.addSizes(sizes);
      } else {
        return res
          .status(500)
          .json({ message: "No se encontraron tallas en la base de datos." });
      }

      return res
        .status(200)
        .json({ message: "Producto cargado exitosamente." });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = postProduct;
