const express= require("express")
const routes =  express.Router();

const productivityController = require("../Controller/productivityController")

routes.get("/get-productivity/",productivityController.get)
routes.post("/create-productivity",productivityController.create)



module.exports=routes