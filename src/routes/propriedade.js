const router = require("express").Router();
const {PropriedadeController} = require("../controllers");
const {create, list, remove,  update} = new PropriedadeController();

router.post("/create", create);
router.delete("/remove", remove);
router.put("/update", update);
router.get("/list", list);

router.use( (_, res) => {
	res.status(400).json({error:"Operação desconhecida com a propriedade"});
});

module.exports = router;

