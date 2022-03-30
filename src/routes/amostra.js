const router = require("express").Router();
const {AmostraController} = require("../controllers");
const {create, list, update, remove} = new AmostraController();

router.post("/create", create);
router.delete("/remove", remove);
router.put("/update", update);
router.get("/list", list);

router.use( (_, res) => {
	res.status(400).json({error:"Operação desconhecida com o registro"});
});

module.exports = router;
