const path = require('path');
const fs = require('fs').promises;


/**
 * Service class for managing user productivity data.
 * Provides methods to find and update productivity data for users.
 * @class
 */
class ProductivityServices {
    /**
     * Constructor for the ProductivityServices class.
     * Initializes the filePath for storing productivity data.
     * @constructor
     */
    constructor() {
        this.filePath = path.join(process.cwd(), 'productivity.json');
    }
    /**
     * Find and retrieve productivity data for a specific user based on their email.
     * @param {string} email - The email of the user for whom productivity data is to be retrieved.
     * @returns {Array|null} - An array of productivity data objects for the specified user's dates, or null if the user is not found.
     * @throws {Error} - Throws an error if there is an issue in finding the user productivity data.
     */

    async find(email) {
        try {
            await this.createFileIfNotExists(); 
            const fileData = await fs.readFile(this.filePath, 'utf-8');
            const data = JSON.parse(fileData);
            const user = data.users.find(user => user.email === email);
            return user ? user.dates : null;
        } catch (error) {
            console.error("Error in finding user productivity:", error);
            throw error;
        }
    }

        /**
     * Create or update productivity data for a specific user on a given date.
     * @param {string} email - The email of the user for whom productivity data is to be created or updated.
     * @param {string} date - The date for which productivity data is to be created or updated.
     * @param {number} completedTask - The number of completed tasks to be added to the productivity data.
     * @throws {Error} - Throws an error if there is an issue in creating or updating the user productivity data.
     */

    async create(email, date, completedTask) {
        console.log("Creating",email,date,completedTask);
        try {
            await this.createFileIfNotExists(); 
            const fileData = await fs.readFile(this.filePath, 'utf-8');
            const data = JSON.parse(fileData);
            const user = data.users.find(user => user.email === email);
       

            if (user) {
               
                const existingDateIndex = user.dates.findIndex(dt => dt.date === date);

                if (existingDateIndex !== -1) {
                    user.dates[existingDateIndex].completedTask += 1;
                } else {
                  
                    user.dates.push({ date, completedTask: +completedTask });
                }
            } else {
               
                data.users.push({
                    email,
                    dates: [{ date, completedTask }],
                });
            }

            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error("Error in saving user productivity data:", error);
            throw error;
        }
    }

        /**
     * Check if the productivity file exists; create it if it doesn't.
     * @throws {Error} - Throws an error if there is an issue in checking or creating the productivity file.
     */

    async createFileIfNotExists() {
        try {
            await fs.access(this.filePath);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.filePath, '{"users": []}', 'utf-8');
            } else {
                throw error;
            }
        }
    }
}

module.exports = ProductivityServices;
