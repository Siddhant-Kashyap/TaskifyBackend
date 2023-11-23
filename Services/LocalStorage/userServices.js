const path = require('path');
const fs = require('fs').promises;
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs')


class UserService {
    constructor() {
        this.filePath = path.join(process.cwd(), 'users.json');
    }

    async find(email) {
        try {
            await this.createFileIfNotExists(); // Create file if not exists
            const fileData = await fs.readFile(this.filePath);
            const data = JSON.parse(fileData);
            // console.log("I am here in find");
            const user = data.find(user => user.email === email);
            return user;
        } catch (error) {
            console.error("Error in finding user:", error);
            throw error;
        }
    }

    async create(user) {
        try {
            await this.createFileIfNotExists(); // Create file if not exists
            const fileData = await fs.readFile(this.filePath);
            const data = JSON.parse(fileData);

            // Push user data
            data.push(user);

            // Write data back to the file
            await fs.writeFile(this.filePath, JSON.stringify(data));
            return user;
        } catch (error) {
            console.error("Error in saving the data:", error);
            throw error;
        }
    }

    async createFileIfNotExists() {
        try {
            await fs.access(this.filePath); // Check if file exists
        } catch (error) {
            if (error.code === 'ENOENT') {
                // File doesn't exist, create it
                await fs.writeFile(this.filePath, '[]');
            } else {
                // Other error, propagate it
                throw error;
            }
        }
    }
    async sendOtp(email,otp){
        try {
    
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'siddhantdssjha@gmail.com', 
                    pass: 'qwkcwxxmcdlbtzal', 
                },
            });
    
            // Configure the email options
            const mailOptions = {
                from: 'siddhantdssjha@gmail.com', // Replace with your Gmail email address
                to: email,
                subject: 'Password Reset OTP',
                text: `Your OTP for password reset is: ${otp}`,
            };
    
            // Send the email
            await transporter.sendMail(mailOptions);
    
            console.log(`Password reset OTP sent to ${email}`);
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
    async createPasswordResetOtp(email) {
        try {
            await this.createFileIfNotExists(); // Create file if not exists
            const fileData = await fs.readFile(this.filePath);
            const data = JSON.parse(fileData);
    
            const user = data.find(user => user.email === email);
            if (user) {
                const otp = otpGenerator.generate(6, { digits: true, upperCase: false, specialChars: false });
                user.resetOtp = otp;
                user.resetOtpExpiration = Date.now() + 300000; // OTP expiration time (5 minutes)
    
                // Write data back to the file
                await this.sendOtp(email, otp); 
                await fs.writeFile(this.filePath, JSON.stringify(data));
                return otp;
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            console.error("Error creating reset OTP:", error);
            throw error;
        }
    }
    
   
    
    
    async verifyPasswordResetOtp(email, otp) {
        try {
            await this.createFileIfNotExists(); // Create file if not exists
            const fileData = await fs.readFile(this.filePath);
            const data = JSON.parse(fileData);
    
            const user = data.find(user => user.email === email && user.resetOtp === otp && user.resetOtpExpiration > Date.now());
            return user;
        } catch (error) {
            console.error("Error verifying reset OTP:", error);
            throw error;
        }
    }
    async resetPassword(email, newPassword) {
        try {
            await this.createFileIfNotExists();
            const fileData = await fs.readFile(this.filePath);
            const data = JSON.parse(fileData);

            const user = data.find(user => user.email === email);
            if (user) {
              
                user.password = await bcrypt.hash(newPassword, 10);
                user.resetOtp = null;
                user.resetOtpExpiration = null;
                await fs.writeFile(this.filePath, JSON.stringify(data));
                return true; 
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            console.error("Error resetting password:", error);
            throw error;
        }
    }
      
    
}

module.exports = UserService;