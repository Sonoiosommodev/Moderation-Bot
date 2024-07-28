const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel],
});

// Lista delle parole proibite
const forbiddenWords = ["lista parole bloccate"];


// Funzione per controllare se un messaggio contiene un link
function containsLink(message) {
    const urlPattern = /https?:\/\/[^\s]+/g;
    return urlPattern.test(message);
}

function containsLink(message) {
    const urlPattern = /discord.gg?/g;
    return urlPattern.test(message);
}


client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const messageContent = message.content.toLowerCase();
    const foundWord = forbiddenWords.find(word => messageContent.includes(word));

    if (foundWord) {
        try {
            await message.delete();
            await message.author.send(`Il tuo messaggio è stato rimosso perché conteneva una parola proibita: ${foundWord}`);
        } catch (error) {
            console.error('Impossibile cancellare il messaggio o inviare un DM:', error);
        }
    } else if (containsLink(message.content) && !message.content.startsWith('!link')) {
        try {
            await message.delete();
            await message.author.send('Il tuo messaggio è stato rimosso perché conteneva un link. Per favore, usa il comando !link per inviare un link.');
        } catch (error) {
            console.error('Impossibile cancellare il messaggio o inviare un DM:', error);
        }
    }
});

client.login('token');
