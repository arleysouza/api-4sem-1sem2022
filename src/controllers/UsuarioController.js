const { Usuario } = require("../models");
const bcrypt = require("bcrypt");
const { generateToken, getToken } = require("../middlewares");

class UsuarioController {
	async login(req, res) {
		let { mail, senha } = req.body;
		mail = (mail || "").toString().trim();
		senha = (senha || "").toString().trim();
		if (senha.length < 6 || senha.length > 10) {
			return res.status(400).json({ error: "A senha deve ter entre 6 e 10 caracteres" });
		}

		return await Usuario.findOne({
			where: { mail },
		})
			.then(async (usuario) => {
				if (usuario) {
					if (usuario.comparePassword(senha, usuario.senha)) {
						// inclui no token o id e e-mail do usuário
						const token = await generateToken({
							idusuario: usuario.idusuario,
							mail: usuario.mail
						});

						// envia para o cliente o token, idusuario e mail
						return res.json({
							token,
							idusuario: usuario.idusuario,
							mail: usuario.mail
						});
					} else
						return res
							.status(400)
							.json({ error: "Dados de login não conferem" });
				} else
					return res.status(400).json({ error: "Usuário não identificado" });
			})
			.catch((e) => {
				return res.status(400).json({ error: e.message });
			});
	}

	async create(req, res) {
		let { mail, senha } = req.body;
		mail = (mail || "").toString().trim();
		senha = (senha || "").toString().trim();
		if (senha.length < 6 || senha.length > 10) {
			return res.status(400).json({ error: "A senha deve ter entre 6 e 10 caracteres" });
		}
		senha = bcrypt.hashSync(senha,bcrypt.genSaltSync(10));

		return await Usuario.create({ mail, senha })
			.then(async (r) => {
				const { idusuario, mail } = r.get();
				return res.status(200).json({ idusuario, mail });
			})
			.catch((err) => {
				// pega os erros de validação emitidos pelo modelo do Sequelize
				if( err.errors.length > 0 ){
					return res.status(400).json({ error: err.errors[0].message });
				}
				else{
					return res.status(400).json({ error: err.message });
				}
			  });
	}

	async updatemail(req, res) {
		// obtém o idusuario que está no token
		const {idusuario} =  await getToken(req);
		let { mail } = req.body;
		mail = (mail || "").toString().trim();

		return await Usuario.findOne({ where: { idusuario } })
			.then(async (usuario) => {
				if (usuario) {
					await usuario.update({ mail });
					return res.json({idusuario:usuario.idusuario, mail:usuario.mail});
				}
				return res.status(400).json({ error: "Usuário não identificado" });
			})
			.catch((err) => {
				if( err.errors.length > 0 ){
					return res.status(400).json({ error: err.errors[0].message });
				}
				else{
					return res.status(400).json({ error: err.message });
				}
			  });
	}

	async updatesenha(req, res) {
		// obtém o idusuario que está no token
		const {idusuario} =  await getToken(req);
		let { senha } = req.body;
		senha = (senha || "").toString().trim();
		if (senha.length < 6 || senha.length > 10) {
			return res.status(400).json({ error: "A nova senha deve ter entre 6 e 10 caracteres" });
		}
		senha = bcrypt.hashSync(senha,bcrypt.genSaltSync(10));

		return await Usuario.findOne({ where: { idusuario } })
			.then(async (usuario) => {
				if (usuario) {
					await usuario.update({ senha });
					return res.json({idusuario:usuario.idusuario, mail:usuario.mail});
				}
				return res.status(400).json({ error: "Usuário não identificado" });
			})
			.catch((err) => {
				if( err.errors.length > 0 ){
					return res.status(400).json({ error: err.errors[0].message });
				}
				else{
					return res.status(400).json({ error: err.message });
				}
			  });
	}
}

module.exports = UsuarioController;
