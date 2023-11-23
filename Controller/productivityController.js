const ProductivityServices = require('../Services/LocalStorage/ProductivityServices')
const productivityServices = new ProductivityServices();


const get= async(req,res)=>{
    
    try{
        const {email} = req.query;
        console.log(email)
    const data  =await productivityServices.find(email);
   
    if (data) {
        res.json(data);
    } else {
        res.status(404).json({ message: 'Productivity data not found for the user.' });
    }

    }

 catch (error) {
    res.status(500).json({ message: 'Internal server error' });

 }
}

const create =async (req,res)=>{
    const {email,date,completedTask}= req.body ;
    console.log("getting value",req.body)
    try{
        if (!date || !completedTask) {
            return res.status(400).json({ message: 'Date and completedTask are required.' });
        }

        await productivityServices.create(email, date, +completedTask);
        res.status(201).json({ message: 'Productivity data created/updated successfully.' });
    
    }catch(error){
        res.status(500).json({ message: 'Internal server error' });
 
    }

}

module.exports={get,create}
