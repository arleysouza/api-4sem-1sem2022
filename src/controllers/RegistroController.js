const { Talhao, Registro } = require("../models");

class RegistroController {
	async create(req, res) {
		let { idtalhao, data } = req.body;
		idtalhao = (idtalhao || "").toString();
		data = (data || "").toString().trim();
		if( idtalhao === "" ){
			return res.status(400).json({ error: "Forneça a identificação do talhão" });
		}

		//verifica se o talhão existe
		return await Talhao.findOne({ where: { idtalhao } })
			.then( async talhao => {
				if( talhao ){
					return await Registro.create({idtalhao,data})
						.then( registro => {
							const { idregistro, idtalhao, data } = registro.get();
							return res.json({ idregistro, idtalhao, data });
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
					return res.status(400).json({ error: "O talhão não foi identificado" });
			})
			.catch((err) => {
				return res.status(400).json({ error: err.message });
		  });
	}

	async update(req, res) {
		let { idregistro, idtalhao, data } = req.body;
		idtalhao = (idtalhao || "").toString();
		idregistro = (idregistro || "").toString();
		data = (data || "").toString().trim();
		if( idtalhao === "" ){
			return res.status(400).json({ error: "Forneça a identificação do talhão" });
		}
		if( idregistro === "" ){
			return res.status(400).json({ error: "Forneça a identificação do registro" });
		}

		return await Registro.findOne({ where: { idregistro} })
			.then( async registro => {
				if( registro ){
					//verifica se o talhão existe
					const talhao = await Talhao.findOne({where:{idtalhao}});
					if( talhao ){
						await registro.update({ idtalhao, data });
						return res.json({idregistro, idtalhao, data});
					}
					return res.status(400).json({ error: "Talhão não identificado" });
				}
				return res.status(400).json({ error: "Registro não identificado" });
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
		let { idregistro } = req.body;
		idregistro = (idregistro || "").toString();
		if( idregistro === "" ){
			return res.status(400).json({ error: "Forneça a identificação do registro" });
		}

		return await Registro.findOne({where: { idregistro }})
			.then(async (registro) => {
				if (registro) {
					await registro.destroy();
					return res.json({ idregistro, idtalhao:registro.idtalhao, data:registro.data });
				}
				return res.status(400).json({ error: "Registro não identificado" });
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
		let { idtalhao, limit, offset } = req.body;
		idtalhao = (idtalhao || "").toString();
		if( idtalhao === "" ){
			return res.status(400).json({ error: "Forneça a identificação do talhão" });
		}

		return await Registro.findAndCountAll({
			where: { idtalhao },
			attributes: ["idregistro","idtalhao", "data"],
			order: [["data", "DESC"]],
			offset,
			limit
		})
			.then((registros) => {
				return res.json({
					registros: registros.rows.map((item) => item.get()),
					count: registros.count,
				});
			})
			.catch((e) => {
				return res.status(400).json({ error: e.message });
			});
	}
}

module.exports = RegistroController;
