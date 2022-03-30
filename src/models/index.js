const Propriedade = require("./Propriedade");
const Registro = require("./Registro");
const Talhao = require("./Talhao");
const Usuario = require("./Usuario");
const Amostra = require("./Amostra");

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
});
Talhao.belongsTo(Propriedade, {foreignKey: "idpropriedade", targetKey: "idpropriedade"});

Talhao.hasMany(Registro, {
	foreignKey: {
		name: "idtalhao",
		allowNull: false
	},
	sourceKey: "idtalhao",
	onDelete: "cascade",
	onUpdate: "cascade",
	hooks: true, //usado para forçar o cascade no onDelete
});
Registro.belongsTo(Talhao, {foreignKey: "idtalhao", targetKey: "idtalhao"});

Registro.hasMany(Amostra, {
	foreignKey: {
		name: "idregistro",
		allowNull: false
	},
	sourceKey: "idregistro",
	onDelete: "cascade",
	onUpdate: "cascade",
	hooks: true, //usado para forçar o cascade no onDelete
});
Amostra.belongsTo(Registro, {foreignKey: "idregistro", targetKey: "idregistro"});

//database.sync({force:true});
database.sync();

module.exports = {
	Propriedade,
	Registro,
	Talhao,
	Usuario,
	Amostra
};
