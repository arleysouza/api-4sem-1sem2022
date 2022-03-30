const { DataTypes } = require("sequelize");
const database = require("../database");

const Registro = database.define(
	"registro",
	{
		idregistro: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		data: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: "Forneça a data de coleta",
				},
				isDate: {
					msg: "A data precisa estar no formato AAAA-MM-DD"
				}
			},
		}
	},
	{
		freezeTableName: true,
	}
);

module.exports = Registro;
