const TaskServices = require('../Services/LocalStorage/taskServices')
const taskServices = new TaskServices();
const { v4: uuidv4 } = require('uuid');


const add = async (req, res) => {
    const { email,category, title, desc, time } = req.body;
    console.log("Hi");
    let taskId;
   // let isUniqueId = false;
    taskId = uuidv4();
    // while (!isUniqueId) {
    //     taskId = uuidv4();


    //     const existingTask = taskServices.findById(task => task.taskId === taskId);

    //     if (!existingTask) {
    //         isUniqueId = true;
    //     }
    //     console.log("I am in While loop")
    // }
    const task = {
        email:email,
        category: category,
        title: title,
        desc: desc,
        time: time
    }
    task.taskId = taskId;
    const task_created = await taskServices.create(task);
    console.log(task_created);
    res.status(201).json({ task: task_created });

}

const getAllTasksByUserId = async (req, res) => {
    const { email } = req.query; 
    
  
    try {
      const tasks = await taskServices.find(email); 
      res.status(201).json({tasks:tasks})
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const updateTask=async (req,res)=>{
   
    const {taskId} = req.query;
   

    const newTask = req.body;
    try {
        const updateTask = await taskServices.update(taskId,newTask);
        res.status(201).json({updated:updateTask})
    } catch (error) {
      
    }
  }
  const deleteTask=async(req,res)=>{
    const taskId = req.query;
    const deleteTask = await taskServices.delete(taskId);
    res.status(200).json({deleteTask:"task Deleted"})

  }
  



module.exports = {add,getAllTasksByUserId,updateTask,deleteTask}