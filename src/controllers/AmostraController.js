const { Amostra, Registro } = require("../models");

class AmostraController {
	async create(req, res) {
		let { idregistro, distanciaentrelinhas, nroplanta2mlineares, nrograoplanta1, nrograoplanta2, latitude, longitude } = req.body;
		idregistro = (idregistro || "").toString();
		distanciaentrelinhas = (distanciaentrelinhas || "").toString();
		nroplanta2mlineares = (nroplanta2mlineares || "").toString().replace(/[^\d]+/g, "");
		nrograoplanta1 = (nrograoplanta1 || "").toString().replace(/[^\d]+/g, "");
		nrograoplanta2 = (nrograoplanta2 || "").toString().replace(/[^\d]+/g, "");
		latitude = (latitude || "").toString().replace(/[^\d\.\-]+/g, "");
		longitude = (longitude || "").toString().replace(/[^\d\.\-]+/g, "");
		if( idregistro === "" ){
			return res.status(400).json({ error: "Forneça a identificação do registro" });
		}

		//verifica se o registro existe
		return await Registro.findOne({ where: { idregistro } })
			.then( async registro => {
				if( registro ){
					// obtém a quantidade de amostras que já existe no registro
					const {count} = await Amostra.findAndCountAll({where: {idregistro}});
					console.log("count", count);
					if( count < 3 ){
						return await Amostra.create({idregistro, distanciaentrelinhas, nroplanta2mlineares, nrograoplanta1, nrograoplanta2, latitude, longitude})
							.then( amostra => {
								const { idamostra, idregistro, distanciaentrelinhas, nroplanta2mlineares, nrograoplanta1, nrograoplanta2, latitude, longitude } = amostra.get();
								return res.json({ idamostra, idregistro, distanciaentrelinhas, nroplanta2mlineares, nrograoplanta1, nrograoplanta2, latitude, longitude });
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
						return res.status(400).json({ error: `Esse registro já possui ${count} amostras` });
				}
				else
					return res.status(400).json({ error: "O registro não foi identificado" });
			})
			.catch((err) => {
				return res.status(400).json({ error: err.message });
			  });
	}

	async update(req, res) {
		let { idamostra, idregistro, distanciaentrelinhas, nroplanta2mlineares, nrograoplanta1, nrograoplanta2, latitude, longitude } = req.body;
		idamostra = (idamostra || "").toString();
		idregistro = (idregistro || "").toString();
		distanciaentrelinhas = (distanciaentrelinhas || "").toString();
		nroplanta2mlineares = (nroplanta2mlineares || "").toString().replace(/[^\d]+/g, "");
		nrograoplanta1 = (nrograoplanta1 || "").toString().replace(/[^\d]+/g, "");
		nrograoplanta2 = (nrograoplanta2 || "").toString().replace(/[^\d]+/g, "");
		latitude = (latitude || "").toString().replace(/[^\d\.\-]+/g, "");
		longitude = (longitude || "").toString().replace(/[^\d\.\-]+/g, "");
		if( idamostra === "" ){
			return res.status(400).json({ error: "Forneça a identificação da amostra" });
		}
		if( idregistro === "" ){
			return res.status(400).json({ error: "Forneça a identificação do registro" });
		}

		return await Amostra.findOne({ where: { idamostra} })
			.then( async amostra => {
				if( amostra ){
					if( amostra.idregistro != idregistro ){
						//verifica se o outro registro existe
						const registro = await Registro.findOne({where: {idregistro}});
						if( registro ){
							//obtém a quantidade amostras desse registro
							const {count} = await Amostra.findAndCountAll({where: {idregistro}});
							if( count > 3 )
								return res.status(400).json({ error: `Já existem ${count} amostras coletadas neste registro` });
						}
						else
							return res.status(400).json({ error: "Registro não identificado" });
					}

					await amostra.update({idregistro, distanciaentrelinhas, nroplanta2mlineares, nrograoplanta1, nrograoplanta2, latitude, longitude});
					return res.json({idamostra, idregistro, distanciaentrelinhas, nroplanta2mlineares, nrograoplanta1, nrograoplanta2, latitude, longitude});
				}
				return res.status(400).json({ error: "Amostra não identificada" });
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
		let { idamostra } = req.body;
		idamostra = (idamostra || "").toString();
		if( idamostra === "" ){
			return res.status(400).json({ error: "Forneça a identificação da amostra" });
		}

		return await Amostra.findOne({where: { idamostra }})
			.then(async (amostra) => {
				if (amostra) {
					await amostra.destroy();
					const { idregistro, distanciaentrelinhas, nroplanta2mlineares, nrograoplanta1, nrograoplanta2, latitude, longitude } = amostra.get();
					return res.json({  idamostra, idregistro, distanciaentrelinhas, nroplanta2mlineares, nrograoplanta1, nrograoplanta2, latitude, longitude });
				}
				return res.status(400).json({ error: "Amostra não identificada" });
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
		let { idregistro, limit, offset } = req.body;
		idregistro = (idregistro || "").toString();
		if( idregistro === "" ){
			return res.status(400).json({ error: "Forneça a identificação do registro" });
		}

		return await Amostra.findAndCountAll({
			where: { idregistro },
			attributes: ["idamostra", "idregistro", "distanciaentrelinhas", "nroplanta2mlineares", "nrograoplanta1", "nrograoplanta2", "latitude", "longitude"],
			order: [["idamostra", "ASC"]],
			offset,
			limit
		})
			.then((amostras) => {
				return res.json({
					amostras: amostras.rows.map((item) => item.get()),
					count: amostras.count,
				});
			})
			.catch((e) => {
				return res.status(400).json({ error: e.message });
			});
	}
}

module.exports = AmostraController;
