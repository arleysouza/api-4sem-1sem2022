const Sequelize = require("sequelize");
require("dotenv").config();

let database = null;
try {
	database = new Sequelize(process.env.BD_URL, {
		logging: false,
	});
	database
		.authenticate()
		.then(() => {
			console.log("Conexão realizada com o SGBD");
		})
		.catch((error) => {
			console.error("Não foi possível conectar com o SGBD:", error.message);
		});
} catch (e) {
	console.log(e.message);
}

/*
// use se desejar testar no SQLite
const database = new Sequelize({
	dialect: "sqlite",
	storage: "banco.db",
	logging: false,
});
*/
module.exports = database;
