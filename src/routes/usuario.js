const router = require("express").Router();
const {UsuarioController} = require("../controllers");
const {authentication} = require("../middlewares");
const {login, create, updatemail, updatesenha} = new UsuarioController();

router.post("/login", login);
router.post("/create", create);
router.put("/update/mail", authentication, updatemail);
router.put("/update/senha", authentication, updatesenha);

router.use( (_, res) => {
	res.status(400).json({error:"Operação desconhecida com o usuário"});
});

module.exports = router;

