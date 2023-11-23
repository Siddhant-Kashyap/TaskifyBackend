const express= require("express")
const routes =  express.Router();
const userController = require("../Controller/userController")
const {validateRegistration} = require('../Middleware/userMiddleware')




routes.post("/login",userController.login)
routes.post("/register",validateRegistration,userController.register)
routes.get('/get',userController.getUser);
routes.post('/otp',userController.requestPasswordResetOtp)
routes.post('/passwordreset',userController.verificationOTP)


module.exports = routes