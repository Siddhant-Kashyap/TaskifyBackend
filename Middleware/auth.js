const jwt = require("jsonwebtoken")
const SECRET_KEY ="ItsmySecretKey"


var auth =(req,res,next)=>{

    //take auth tonken
    try {
        var token = req.headers.authorization;
        if(token){
            token = token.split(" ")[1]
            let user = jwt.verify(token,SECRET_KEY)
            req.userId = user.id;
            // console.log(req.userId)

        }else{
            res.status(401).json({message:"Unauthorized access"})
        }
        // console.log(token)
        next();
        
    } catch (error) {
        console.log(error)
        res.status(401).json({message:"Unauthorized access"})
        
    }

    
}

module.exports=auth