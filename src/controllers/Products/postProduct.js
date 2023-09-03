const { Product, Size } = require("../../DataBase");
const products = require("./arrayProducts");

function getRandomQuantity(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const postProduct = async (req, res) => {
  try {
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
              stock: getRandomQuantity(50, 500), // Número aleatorio entre 50 y 500
            });

            // Obtener un número aleatorio de tallas para asignar al producto
            const randomSizeCount = getRandomQuantity(1, sizes.length);
            const randomSizes = [];

            // Crear una lista de índices de tallas únicos aleatorios
            while (randomSizes.length < randomSizeCount) {
              const randomIndex = getRandomQuantity(0, sizes.length - 1);
              if (!randomSizes.includes(randomIndex)) {
                randomSizes.push(randomIndex);
              }
            }

            // Asignar las tallas aleatorias al producto
            await product.addSizes(randomSizes.map((index) => sizes[index]));
          })
        );
      } else {
        return res
          .status(500)
          .json({ message: "No se encontraron tallas en la base de datos." });
      }

      return res
        .status(200)
        .json({ message: "Productos cargados exitosamente." });
    } else {
      const {
        name,
        gender,
        category,
        mainMaterial,
        images,
        price,
        description,
        sizes,
        stock,
      } = req.body;

      if (
        !name ||
        !gender ||
        !category ||
        !mainMaterial ||
        !images ||
        !price ||
        !description ||
        !sizes ||
        !stock
      ) {
        return res.status(400).json({ error: "Faltan datos!!!" });
      }

      const modifiedSizes = {};

      // Itera sobre las claves del objeto sizes
      for (const key in sizes) {
        if (sizes.hasOwnProperty(key)) {
          // Elimina "sizes_" y convierte la clave a minúsculas
          const modifiedKey = key.replace("sizes_", "");

          // Asigna el valor correspondiente al nuevo objeto
          modifiedSizes[modifiedKey] = sizes[key];
        }
      }

      const createdProduct = await Product.create({
        name,
        gender,
        category,
        mainMaterial,
        images,
        price,
        description,
        stock,
      });

      // Obtener las claves (tallas) del objeto modifiedSizes
      const sizeKeys = Object.keys(modifiedSizes);

      // Iterar sobre las tallas y guardarlas en la base de datos (si no existen)
      for (const sizeKey of sizeKeys) {
        const size = await Size.findOrCreate({
          where: { name: sizeKey },
          defaults: { delete: false }, // Asegura que el registro no esté marcado como eliminado
        });

        // Relaciona el producto con la talla
        await createdProduct.addSize(size[0]);
      }

      return res
        .status(200)
        .json({ message: "Producto cargado exitosamente." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = postProduct;

// Codigfo Anterior (carga todos los talles en todos los productos):
// const { Product, Size } = require("../../DataBase");
// const products = require("./arrayProducts");

// function getRandomQuantity(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// const postProduct = async (req, res) => {
//   try {
//     const { name, gender, category, mainMaterial, images, price, description } =
//       req.body;

//     const productCount = await Product.count();

//     if (productCount === 0) {
//       await Product.bulkCreate(products);

//       const sizes = await Size.findAll();

//       if (sizes && sizes.length > 0) {
//         const allProducts = await Product.findAll();
//         await Promise.all(
//           allProducts.map(async (product) => {
//             // Agregar stock directamente al producto
//             await product.update({
//               stock: getRandomQuantity(50, 500), // Número aleatorio entre 1 y 100
//             });

//             await product.addSizes(sizes);
//           })
//         );
//       } else {
//         return res
//           .status(500)
//           .json({ message: "No se encontraron tallas en la base de datos." });
//       }

//       return res
//         .status(200)
//         .json({ message: "Producto(s) cargado(s) exitosamente." });
//     } else {
//       const newProduct = await Product.create({
//         name,
//         gender,
//         category,
//         mainMaterial,
//         images,
//         price,
//         description,
//       });

//       const sizes = await Size.findAll();

//       if (sizes && sizes.length > 0) {
//         // Agregar stock directamente al producto
//         await newProduct.update({
//           stock: getRandomQuantity(1, 100), // Número aleatorio entre 1 y 100
//         });

//         await newProduct.addSizes(sizes);
//       } else {
//         return res
//           .status(500)
//           .json({ message: "No se encontraron tallas en la base de datos." });
//       }

//       return res
//         .status(200)
//         .json({ message: "Producto cargado exitosamente." });
//     }
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// module.exports = postProduct;
