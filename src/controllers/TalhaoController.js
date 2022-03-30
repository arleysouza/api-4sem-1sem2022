const { Talhao, Propriedade } = require("../models");
const {getToken} = require("../middlewares");

class TalhaoController {
	async create(req, res) {
		const {idusuario} = await getToken(req);
		let { idpropriedade, nome, geom } = req.body;
		idpropriedade = (idpropriedade || "").toString();
		nome = (nome || "").toString().trim();
		geom = (geom || "").toString().trim();
		if( idpropriedade === "" ){
			return res.status(400).json({ error: "Forneça a identificação da propriedade" });
		}

		//verifica se o talhão pertence a uma propriedade do usuário
		return await Propriedade.findOne({ where: { idpropriedade, idusuario } })
			.then( async propriedade => {
				if( propriedade ){
					return await Talhao.create({idpropriedade,nome,geom})
						.then( talhao => {
							const { idpropriedade, nome, geom } = talhao.get();
							return res.json({ idpropriedade, nome, geom });
						})
						.catch((err) => {
							if( err.errors && err.errors.length > 0 ){
								return res.status(400).json({ error: err.errors[0].message });
							}
							else{
								return res.status(400).json({ error: err.message });
							}
					  });
				}
				else
					return res.status(400).json({ error: "A propriedade não foi identificada" });
			})
			.catch((err) => {
				return res.status(400).json({ error: err.message });
		  });
	}

	async update(req, res) {
		let { idtalhao, idpropriedade, nome, geom } = req.body;
		idtalhao = (idtalhao || "").toString();
		idpropriedade = (idpropriedade || "").toString();
		nome = (nome || "").toString().trim();
		geom = (geom || "").toString().trim();
		if( idtalhao === "" ){
			return res.status(400).json({ error: "Forneça a identificação do talhão" });
		}
		if( idpropriedade === "" ){
			return res.status(400).json({ error: "Forneça a identificação da propriedade" });
		}

		return await Talhao.findOne({ where: { idtalhao} })
			.then( async talhao => {
				if( talhao ){
					//verifica se a propriedade existe
					const propriedade = await Propriedade.findOne({where:{idpropriedade}});
					if( propriedade ){
						await talhao.update({ idpropriedade, nome, geom });
						return res.json({idtalhao, idpropriedade, nome, geom});
					}
					return res.status(400).json({ error: "Propriedade não identificada" });
				}
				return res.status(400).json({ error: "Talhão não identificado" });
			})
			.catch((err) => {
				if( err.errors && err.errors.length > 0 ){
					return res.status(400).json({ error: err.errors[0].message });
				}
				else{
					return res.status(400).json({ error: err.message });
				}
			  });
	}

	async remove(req, res) {
		let { idtalhao } = req.body;
		idtalhao = (idtalhao || "").toString();
		if( idtalhao === "" ){
			return res.status(400).json({ error: "Forneça a identificação do talhão" });
		}

		return await Talhao.findOne({where: { idtalhao }})
			.then(async (talhao) => {
				if (talhao) {
					await talhao.destroy();
					return res.json({ idtalhao, nome:talhao.nome });
				}
				return res.status(400).json({ error: "Talhão não identificado" });
			})
			.catch((err) => {
				if( err.errors && err.errors.length > 0 ){
					return res.status(400).json({ error: err.errors[0].message });
				}
				else{
					return res.status(400).json({ error: err.message });
				}
			  });
	}

	async list(req, res) {
		let { idpropriedade, limit, offset } = req.body;
		idpropriedade = (idpropriedade || "").toString();
		if( idpropriedade === "" ){
			return res.status(400).json({ error: "Forneça a identificação da propriedade" });
		}

		return await Talhao.findAndCountAll({
			where: { idpropriedade },
			attributes: ["idpropriedade", "idtalhao", "nome", "geom"],
			order: [["nome", "ASC"]],
			offset,
			limit
		})
			.then((talhoes) => {
				return res.json({
					talhoes: talhoes.rows.map((item) => item.get()),
					count: talhoes.count,
				});
			})
			.catch((e) => {
				return res.status(400).json({ error: e.message });
			});
	}
}

module.exports = TalhaoController;
