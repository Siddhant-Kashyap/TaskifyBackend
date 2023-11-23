const UserModel = require("../Model/userModel")

class UserService{

    find = async (email)=>{
        try {
            const user =  await UserModel.findOne({email:email})
            return user;
        } catch (error) {
            throw new Error('Error fetching user');
        }
       

    }
    save = async (user)=>{
        try{

            const result = await user.save();
            return result;
        }
        catch(e){
            throw new Error('Error saving user');
        }
       
    }
    create =async (user)=>{

        try {
            const newUser = new UserModel(user);
       const saveUser = await this.save(newUser);
       return saveUser;
        } catch (error) {
            throw new Error('Error creating user');
        }
       
    }




}

module.exports = UserService