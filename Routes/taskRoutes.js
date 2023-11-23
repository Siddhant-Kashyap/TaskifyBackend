const express= require("express")
const routes =  express.Router();
const taskController = require('../Controller/taskController')

routes.get("/getAll",taskController.getAllTasksByUserId);
routes.post("/add",taskController.add);
routes.put("/update",taskController.updateTask)
routes.delete("/delete",taskController.deleteTask);
module.exports=routes