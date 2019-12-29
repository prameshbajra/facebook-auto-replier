require('dotenv').config();

const fs = require("fs");

const {
    Client
} = require('libfb')
const client = new Client()

client.login(process.env.FB_EMAIL, process.env.FB_PASSWORD).then(() => {
    // Record messages and the user details ...
    client.on(`message`, async message => {
        const userId = message.threadId;
        const incomingMessage = message.message;

        const userInfo = await client.getUserInfo(userId);
        const content = {
            [userId]: userInfo
        };

        // fs.appendFile(`./logs/log-2019-12-29.txt`, JSON.stringify(content), function (err) {
        //     if (err) throw err;
        //     console.log(`Saved !`);
        // });
        console.log(JSON.stringify(content));

        client.sendMessage(userId,
            `Hey ${userInfo.name}, I am currently working on something. Will get back to you later. Don't mind :)`);
    });
}).catch((error) => {
    console.error(`Error here :-> ${error}`);
});