// const UserService = require('../Services/userServices')
const UserService =require('../Services/LocalStorage/userServices')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const SECRET_KEY ="ItsmySecretKey"


const userServices = new UserService()


const login=async (req,res)=>{

    const {email,password} = req.body;
    try{
        const existingUser  = await userServices.find(email);
        console.log(existingUser)
        if(!existingUser){
            return res.status(404).json({Email:"User not found"})
        }
        const matchPassword = await bcrypt.compare(password,existingUser.password);
        if(!matchPassword){
            return res.status(400).json({Password:"Invalid credentials"})
        }
        const token = jwt.sign({email:existingUser.email ,name:existingUser.name ,id:existingUser._id},SECRET_KEY);
            res.status(201).json({token:token})

    }catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})

    }
   

}

const register =async (req,res)=>{
    try {
      const { firstName, lastName, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        name: firstName+lastName,
        email: email,
        password: hashedPassword,
      };
      const existingUser = await userServices.find(email);
      if (existingUser) {
        res.send("User Already existed");
      } else {
        const user_created = await userServices.create(user);
        const token ="abcdef"

        // const token = jwt.sign(
        //   { email: user_created.email, id: user_created._id },
        //   SECRET_KEY
        // );
        res.status(201).json({ user: user_created, token: token });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
    
   
    
}
const getUser = async (req,res)=>{
  try {
    const email= req.query;
    console.log(email.email)
    const response = await userServices.find(email.email);
    console.log(response)
    res.status(200).json({user:response})
    
  } catch (error) {
    res.status(400).json({msg:"User not found"})
  }
 
  
}
const requestPasswordResetOtp = async (req, res) => {
  const { email } = req.body;

  try {
      const existingUser = await userServices.find(email);

      if (!existingUser) {
          return res.status(404).json({ email: "User not found" });
      }

      const resetOtp = await userServices.createPasswordResetOtp(email);

      // Send the OTP to the user (e.g., through email or SMS)

      res.status(200).json({ message: "Password reset OTP sent successfully." });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

const verificationOTP = async (req, res) => {
  const { email, otp,newPassword } = req.body;
  
  try {
      const user = await userServices.verifyPasswordResetOtp(email, otp);
      

      if (!user) {
          return res.status(400).json({ otp: "Invalid or expired OTP" });
      }
      await userServices.resetPassword(email, newPassword);

      res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};






module.exports = {login , register,getUser,requestPasswordResetOtp,verificationOTP}