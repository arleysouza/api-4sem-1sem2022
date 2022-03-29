const { DataTypes } = require("sequelize");
const database = require("../database");

const Talhao = database.define(
	"talhao",
	{
		idtalhao: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		nome: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça o nome do talhão"
				}
			},
		},
		geom: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça o polígono do talhão"
				}
			},
		}
	},
	{
		freezeTableName: true,
	}
);

module.exports = Talhao;
