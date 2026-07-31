const { Client, GatewayIntentBits } = require('discord.js');
const { Rcon } = require('rcon-client');

const config = {
    token: process.env.DISCORD_TOKEN,
    channelId: process.env.DISCORD_CHANNEL_ID,
    mcIp: process.env.MINECRAFT_IP,
    rconPort: parseInt(process.env.RCON_PORT || '25575'),
    rconPassword: process.env.RCON_PASSWORD
};

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', async () => {
    console.log(`Бот ${client.user.tag} запущен на хостинге!`);
    
    try {
        const rcon = await Rcon.connect({ host: config.mcIp, port: config.rconPort, password: config.rconPassword });
        console.log("Успешное подключение к RCON сервера Майнкрафт!");

        client.on('messageCreate', async (message) => {
            if (message.author.bot || message.channel.id !== config.channelId) return;
            
            const cleanText = message.content.replace(/[/]/g, '');
            await rcon.send(`tellraw @a [{"text":"[Discord] ${message.author.username}: ${cleanText}","color":"aqua"}]`);
        });

    } catch (err) {
        console.error("Ошибка подключения к RCON Майнкрафта:", err.message);
    }
});

client.login(config.token);
