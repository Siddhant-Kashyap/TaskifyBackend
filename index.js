const express = require("express")
const app = express();
const dbConnect = require("./Config/dbConnection");
const userRoutes = require("./Routes/userRoutes")
const taskRoutes =require("./Routes/taskRoutes")
const productivityRoutes = require("./Routes/productivityRoutes")
var cors = require('cors')

// dbConnect();
app.use(express.json());
const PORT = 8080;

app.use(cors())
app.use(express.urlencoded({ extended: true }));


//routes
app.use("/user",userRoutes)
app.use("/task",taskRoutes)
app.use("/productivity",productivityRoutes)


app.listen(PORT,()=>{
    console.log(`Server is up ${PORT}`)
})