require('dotenv').config();

const fs = require("fs");
const axios = require("axios");
const schedule = require('node-schedule');

const {
    Client
} = require('libfb')
const client = new Client()

client.login(process.env.FB_EMAIL, process.env.FB_PASSWORD).then(() => {
    // Record messages and the user details ...
    console.log(`Logged in with ${process.env.FB_EMAIL}`);
    let alreadyRepliedUser = []
    client.on(`message`, async message => {
        const userId = message.threadId;
        const incomingMessage = message.message;
        if (!alreadyRepliedUser.includes(userId)) {
            const userInfo = await client.getUserInfo(userId);
            const content = {
                [userId]: userInfo
            };

            fs.appendFile(`./logs/log-2019-12-29.txt`, JSON.stringify(content), function (err) {
                if (err) throw err;
                console.log(`Saved !`);
            });
            client.sendMessage(userId,
                `Hey ${userInfo.name}, I am currently working on something. Will get back to you later. Don't mind :)`);
            alreadyRepliedUser.push(userId);
        }
    });

    // Run schedule to send message at scheduled time ...
    const scheduledJob = schedule.scheduleJob('30 21 * * *', () => {
        axios({
            "method": "GET",
            "url": process.env.QUOTE_API_URL
        }).then((response) => {
            const usersToSendMessageTo = JSON.parse(process.env.MESSAGE_USERS)
            for (let [user, userId] of Object.entries(usersToSendMessageTo)) {
                const randomPicked = response.data.quote.quote;
                console.log(`Sending ${user} a quote : ${randomPicked}`);
                client.sendMessage(userId + ``,
                    `Hey ${user}, Here's a good night quote. ${randomPicked}`);
            }
        }).catch((error) => {
            console.error(error)
        })
    });
}).catch((error) => {
    console.error(`Error here :-> ${error}`);
});

