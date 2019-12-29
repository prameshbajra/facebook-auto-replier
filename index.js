require('dotenv').config();

const fs = require("fs");

const { Client } = require('libfb')
const client = new Client()

client.login(process.env.FB_EMAIL, process.env.FB_PASSWORD).then(() => {
    const messages = [`Hey, what's up?`, `Please ignore this message`];
    const messageUsers = JSON.parse(process.env.MESSAGE_USERS);

    for (const [userName, userId] of Object.entries(messageUsers)) {
        const pickedMessage = messages[Math.floor(Math.random() * messages.length)];
        console.log(`Sending message ${pickedMessage} to ${userName}`);
        client.sendMessage(userId + ``, pickedMessage);
        console.log(`DONE !!`);
    }
}).catch((error) => {
    console.error(`Error here :-> ${error}`);
});