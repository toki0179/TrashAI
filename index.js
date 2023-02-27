const discord = require('discord.js')
const { GatewayIntentBits } = require('discord.js')
const config = require('./config.json')
let savedWords = require('./words.json')
const fsp = require('fs/promises')
const grammarify = require('grammarify')

const client = new discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ]
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity(`This is a shitty ai`);
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return
    if (message.content.startsWith(config.prefix)) return
    if (message.channel.id !== config.chatGPTChannel) return
    if (message.content.includes("https://")) return;
    if (message.content.includes("discord.gg")) return;
    if (message.content.includes("http://")) return;

    if (message.channel.id !== config.chatGPTChannel) return;

    // add each word from the message to config.json
    let words = message.content.split(" ");

    for (let i = 0; i < words.length; i++) {
        if (words[i].length > 2) {
            savedWords.words.push(words[i]);
        }
    }

    await fsp.writeFile('./words.json', JSON.stringify(savedWords, null, 2));

    let reply = "";
    // random message length between 1 and 16
    for (let i = 0; i < randomInt(1, 16); i++) {
        let randomWord = savedWords.words[Math.floor(Math.random() * savedWords.words.length)];
        // if the word is already in the reply, don't add it and find another word
        while (reply.includes(randomWord)) {
            randomWord = savedWords.words[Math.floor(Math.random() * savedWords.words.length)];
        }
        reply += randomWord + " ";
    }

    return message.reply(grammarify.clean(reply));
});

client.login(config.token)



function randomInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}