const router = require("express").Router();
const { authentication } = require("../middlewares");
const usuarioRoute = require("./usuario");
const propriedadeRoute = require("./propriedade");
const talhaoRoute = require("./talhao");

router.use("/usuario", usuarioRoute);
router.use("/propriedade", authentication, propriedadeRoute);
router.use("/talhao", authentication, talhaoRoute);

router.use( (_, res) => {
	res.status(400).json({error:"Operação desconhecida"});
});

module.exports = router;
