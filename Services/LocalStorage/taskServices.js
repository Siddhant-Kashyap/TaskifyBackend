const path = require('path');
const fs = require('fs').promises;

/**
 * Service class for managing tasks data.
 * Provides methods to find, create, update, and delete tasks.
 * @class
 */
class TaskServices {
    /**
     * Constructor for the TaskServices class.
     * Initializes the filePath for storing tasks data.
     * @constructor
     */
    constructor() {
        this.filePath = path.join(process.cwd(), 'tasks.json');
    }

     /**
     * Find tasks associated with a specific user based on their user ID.
     * @param {string} userId - The user ID for whom tasks are to be retrieved.
     * @returns {Array} - An array of tasks associated with the specified user ID.
     * @throws {Error} - Throws an error if there is an issue in finding the user's tasks.
     */
    async find(userId) {
        try {
            await this.createFileIfNotExists();
            const fileData = await fs.readFile(this.filePath);
            const data = JSON.parse(fileData);
    
            const tasks = data.filter(task => task.email === userId);
            console.log(tasks);
            return tasks;
        } catch (error) {
            console.error("Error in finding user:", error);
            throw error;
        }
    }
     /**
     * Find a task by its task ID.
     * @param {string} taskID - The task ID for the task to be retrieved.
     * @returns {Object|null} - The task object if found, or null if the task is not found.
     * @throws {Error} - Throws an error if there is an issue in finding the task.
     */
    async findById(taskID){
        try {
            await this.createFileIfNotExists(); // Create file if not exists
            const fileData = await fs.readFile(this.filePath);
            const data = JSON.parse(fileData);
            // console.log("I am here in find");
            const task = data.find(task => task.taskID === taskID);
            return task;
        } catch (error) {
            console.error("Error in finding user:", error);
            throw error;
        }

    }
      /**
     * Update an existing task based on its task ID.
     * @param {string} taskID - The task ID for the task to be updated.
     * @param {Object} updatedTask - The updated task object.
     * @returns {Object} - The updated task object.
     * @throws {Error} - Throws an error if there is an issue in updating the task.
     */
    async update(taskID, updatedTask) {
        try {
            await this.createFileIfNotExists();
            const fileData = await fs.readFile(this.filePath, 'utf-8');
            let data = JSON.parse(fileData);
            console.log("Data",data);
            const index = data.findIndex(task => task.taskId === taskID);
            console.log("Task Id",taskID)
            console.log("Index",index)
    
            if (index !== -1) {
                data[index] = { ...data[index], ...updatedTask };
                await fs.writeFile(this.filePath, JSON.stringify(data));
                return data[index];
            } else {
                throw new Error(`Task with ID ${taskID} not found`);
            }
        } catch (error) {
            console.error("Error in updating the data:", error);
            throw error;
        }
    }
    

     /**
     * Create a new task.
     * @param {Object} task - The task object to be created.
     * @returns {Object} - The created task object.
     * @throws {Error} - Throws an error if there is an issue in creating the task.
     */
    async create(task) {
        try {
            await this.createFileIfNotExists(); // Create file if not exists
            const fileData = await fs.readFile(this.filePath,'utf-8');
            const data = JSON.parse(fileData);

            // Push user data
            data.push(task);

            await fs.writeFile(this.filePath, JSON.stringify(data));
            return task;
        } catch (error) {
            console.error("Error in saving the data:", error);
            throw error;
        }
    }
     /**
     * Delete an existing task based on its task ID.
     * @param {string} taskID - The task ID for the task to be deleted.
     * @returns {Object} - The deleted task object.
     * @throws {Error} - Throws an error if there is an issue in deleting the task.
     */
    async delete(taskID) {
       
        try {
            await this.createFileIfNotExists(); // Create file if not exists
            const fileData = await fs.readFile(this.filePath, 'utf-8');
            let data = JSON.parse(fileData);
            const index = data.findIndex(task => task.taskId === taskID.taskId);
           
    
            if (index !== -1) {
                const deletedTask = data.splice(index, 1);
                await fs.writeFile(this.filePath, JSON.stringify(data));
                return deletedTask[0];
            } else {
                throw new Error(`Task with ID ${taskID} not found`);
            }
        } catch (error) {
            console.error("Error in deleting the data:", error);
            throw error;
        }
    }
      /**
     * Check if the tasks file exists; create it if it doesn't.
     * @throws {Error} - Throws an error if there is an issue in checking or creating the tasks file.
     */

    async createFileIfNotExists() {
        try {
            await fs.access(this.filePath); // Check if file exists
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File doesn't exist, create it
                await fs.writeFile(this.filePath, '[]');
            } else {
                
                throw error;
            }
        }
    }
}

module.exports= TaskServices;