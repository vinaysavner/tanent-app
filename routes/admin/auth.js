const express = require('express');
const router  = express.Router();
const adminController = require('../../controller/adminController/auth')

router.get('/login',adminController.login)
router.get('/',adminController.signUp)
router.get('/verify',adminController.verify)
router.get('/dashboard',adminController.dashboard)
router.get('/query',adminController.query)



module.exports = router;