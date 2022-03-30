const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const database = require("../database");

const Usuario = database.define(
	"usuario",
	{
		idusuario: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		mail: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
				msg: "O e-mail já existe no cadastro",
			},
			validate: {
				notEmpty:{
					msg: "Forneça um e-mail"
				},
				isEmail: {
					msg: "Forneça um e-mail válido",
				},
			},
		},
		senha: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty:{
					msg: "Forneça a senha"
				}
			},
		},
	},
	{
		freezeTableName: true
	}
);

// adiciona o método camparePasswor no modelo usuário
Usuario.prototype.comparePassword = (senha, hash) => {
	return bcrypt.compareSync(senha, hash);
};

module.exports = Usuario;
