const Propriedade = require("./Propriedade");
//const Registro = require("./Registro");
const Talhao = require("./Talhao");
const Usuario = require("./Usuario");

const database = require("../database");

Usuario.hasMany(Propriedade, {
	foreignKey: {
		name: "idusuario",
		allowNull: false
	},
	sourceKey: "idusuario",
	onDelete: "cascade",
	onUpdate: "cascade",
	hooks: true, //usado para forçar o cascade no onDelete
	validate: {
		notNull: {
			msg: "Forneça a identificação do usuario",
		},
		foreignkey: async (idusuario, next) => {
			const usuario = await Usuario.findOne({ where: { idusuario } });
			if( usuario === null ){
				return next(`Usuário ${idusuario} não identificado`);
			}
			return next();
		}
	}
});
Propriedade.belongsTo(Usuario, {foreignKey: "idusuario", targetKey: "idusuario"});

Propriedade.hasMany(Talhao, {
	foreignKey: {
		name: "idpropriedade",
		allowNull: false
	},
	sourceKey: "idpropriedade",
	onDelete: "cascade",
	onUpdate: "cascade",
	hooks: true, //usado para forçar o cascade no onDelete
	validate: {
		notNull: {
			msg: "Forneça a identificação da propriedade",
		},
		foreignkey: async (idpropriedade, next) => {
			const propriedade = await Propriedade.findOne({ where: { idpropriedade } });
			if( propriedade === null ){
				return next(`Propriedade ${idpropriedade} não identificada`);
			}
			return next();
		}
	}
});
Talhao.belongsTo(Propriedade, {foreignKey: "idpropriedade", targetKey: "idpropriedade"});

database.sync();

module.exports = {
	Propriedade,
	//Registro,
	Talhao,
	Usuario
};
