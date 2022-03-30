const router = require("express").Router();
const {RegistroController} = require("../controllers");
const {create, list, update, remove} = new RegistroController();

router.post("/create", create);
router.delete("/remove", remove);
router.put("/update", update);
router.get("/list", list);

router.use( (_, res) => {
	res.status(400).json({error:"Operação desconhecida com o registro"});
});

module.exports = router;
