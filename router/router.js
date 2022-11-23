const express = require('express')
const router =express.Router()

const {createSpavePdf}=require("../controller/controller")
router.get('/createSpavePdf',createSpavePdf)
module.exports = router