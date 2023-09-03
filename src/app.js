const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const server = express();
// Rutas para el usuario:
const login = require("./routes/Users_Routes/login.routes"); // Ruta para iniciar sesión de usuario"
const register = require("./routes/Users_Routes/register.routes"); // Ruta para registrar un usuario
const deleteUser = require("./routes/Users_Routes/deleteUser.routes"); // Ruta para eliminar un usuario
const updataUser = require("./routes/Users_Routes/updateUser.routes"); // Ruta para actualizar información de usuario
const getUser = require("./routes/Users_Routes/getUsers.routes"); // Ruta para obtener información de usuario

// Rutas para las prendas:
const getProducts = require("./routes/Products_Routes/getProduct.routes"); // Ruta para obtener información de prendas
const postProducts = require("./routes/Products_Routes/postProduct.routes"); // Ruta para crear una nueva prenda
const deleteProducts = require("./routes/Products_Routes/deleteProduct.routes"); // Ruta para eliminar una prenda
const updateProducts = require("./routes/Products_Routes/updateProduct.routes"); // Ruta para actualizar información de prendas
const postSize = require("./routes/Products_Routes/Size/postSize.routes");
const getSize = require("./routes/Products_Routes/Size/getSize.routes");

//
const getGender = require("./routes/Products_Routes/getGender.routes");

const filter = require("./routes/Filters_Routes/filterProduct.routes");
const detail = require("./routes/Products_Routes/getProductById.routes");
const getCategory = require("./routes/Products_Routes/getCategory.routes");

// Middlewares
server.use(express.json()); // Parsea las solicitudes como JSON
server.use(cors()); // Habilita CORS para permitir solicitudes desde otros dominios
server.use(morgan("dev")); // Registro de solicitudes en la consola en formato 'dev'

// Rutas
server.use("/", login); // Ruta para iniciar sesión de usuario
server.use("/", register); // Ruta para registrar un usuario
server.use("/", deleteUser); // Ruta para eliminar un usuario
server.use("/", updataUser); // Ruta para actualizar información de usuario
server.use("/", getUser); // Ruta para obtener información de usuario

server.use("/", getProducts); // Ruta para obtener información de prendas
server.use("/", postProducts); // Ruta para crear una nueva prenda
server.use("/", deleteProducts); // Ruta para eliminar una prenda
server.use("/", updateProducts); // Ruta para actualizar información de prendas

// Rutas para el talle:
server.use("/", postSize);
server.use("/", getSize);
server.use("/", detail);

///

server.use("/", getGender);
server.use("/", getCategory);

// Ruta para los filtros
server.use("/", filter);

module.exports = server; // Exportar el servidor configurado
