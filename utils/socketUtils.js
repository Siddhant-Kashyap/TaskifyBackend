const { readChatHistory, writeChatHistory } = require('./chatHistoryUtils'); 
const emailToSocketMap = new Map(); 

function handleConnection(socket,io) {
    console.log('A user connected');

    socket.on('login', (email) => {
        emailToSocketMap.set(email, socket.id);
        console.log(`User logged in with email: ${email}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
       
        emailToSocketMap.forEach((socketID, email) => {
            if (socketID === socket.id) {
                emailToSocketMap.delete(email);
            }
        });
    });

    socket.on('chat message', async (data) => {
        const { sender, recipient, message } = data;
        
        const senderSocketID = emailToSocketMap.get(sender);
        const recipientSocketID = emailToSocketMap.get(recipient);

        if (senderSocketID && recipientSocketID) {
            io.to(recipientSocketID).emit('chat message', { sender, message });// Save message to chat history
            const chatHistory = await readChatHistory();
            chatHistory.push(data);
            await writeChatHistory(chatHistory);
        } else {
            console.log(`One or both email addresses not found: ${sender}, ${recipient}`);
        }
    });
}

module.exports = {
    handleConnection
};