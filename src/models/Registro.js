const { DataTypes } = require("sequelize");
const database = require("../database");
const Talhao = require("./Talhao");

const Registro = database.define(
	"talhao",
	{
		idregistro: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		data: {
			type: DataTypes.DATEONLY,
			allowNull: false,
			validate: {
				notNull: {
					msg: "Forneça a data de coleta",
				},
				isDate: {
					msg: "A data precisa estar no formato AAAA-MM-DD"
				}
			},
		},
		idtalhao: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Talhao,
				key: "idtalhao",
			},
			onDelete: "restrict",
			onUpdate: "cascade",
			hooks: true,
			validate: {
				notNull: {
					msg: "Forneça a identificação do talhão",
				},
				foreignkey: async (idtalhao, next) => {
					const talhao = await Talhao.findOne({ where: { idtalhao } });
					if( talhao === null ){
						return next(`Talhão ${idtalhao} não identificado`);
					}
					return next();
				}
			}
		},
	},
	{
		freezeTableName: true,
	}
);

module.exports = Registro;
