require("dotenv").config();
const { Sequelize } = require("sequelize");
const { DB_NAME, DB_PASSWORD, DB_HOST, DB_USER, PORT } = process.env;
const ProductModel = require("./models/Product");
const SizeModel = require("./models/Size");
const UserModel = require("./models/User");

const sequelize = new Sequelize(
  "postgresql://postgres:3Np1iaw5tEdlAXEwKiVG@containers-us-west-166.railway.app:5846/railway",
  {
    logging: false,
  }
);

// Inicializar modelos
ProductModel(sequelize);
SizeModel(sequelize);
UserModel(sequelize);

const { Product, Size } = sequelize.models;

// Configurar relaciones
Product.belongsToMany(Size, { through: "ProductItem" });
Size.belongsToMany(Product, { through: "ProductItem" });

module.exports = {
  ...sequelize.models,
  connect: sequelize,
};
