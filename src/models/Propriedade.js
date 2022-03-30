const { DataTypes } = require("sequelize");
const database = require("../database");

const Propriedade = database.define(
	"propriedade",
	{
		idpropriedade: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		nome: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça o nome da propriedade"
				}
			},
		}
	},
	{
		freezeTableName: true,
	}
);

module.exports = Propriedade;
