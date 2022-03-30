const { DataTypes } = require("sequelize");
const database = require("../database");

const Amostra = database.define(
	"amostra",
	{
		idamostra: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		foto: {
			type: DataTypes.BLOB,
			allowNull: true
		},
		distanciaentrelinhas: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça a distância entre as linhas"
				}
			},
		},
		nroplanta2mlineares: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça o número de plantas em 2m lineares"
				}
			},
		},
		nrograoplanta1: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça a quantidade de grãos da 1a planta"
				}
			},
		},
		nrograoplanta2: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça a quantidade de grãos da 2a planta"
				}
			},
		},
		latitude: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça a latitude"
				}
			},
		},
		longitude: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça a longitude"
				}
			},
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = Amostra;
