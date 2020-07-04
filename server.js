//ESTE CODIGO NO AFECTARA SU BOT, SCRIPT DE ARRANQUE

const http = require('http');
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`); 
}, 10000);


//DESDE AQUI EMPIEZA A ESCRIBIR EL CODIGO PARA SU BOT




/*
    Configuracion del archivo .env
    TOKEN=TokenBot
 */

// Importación de librerías
const { Client, MessageEmbed, escapeMarkdown } = require("discord.js");
const ytdl = require('ytdl-core');
const db = require('megadb');
const prefixsDB = new db.crearDB('prefixsDB');
const client = new(class Bot extends Client {
    constructor() {
        super();
        this.queue = new Map()
    }
    log(msg, e = false) {
        console.log(`\x1b[36m[${new Date().toLocaleTimeString()}]${e ? "\x1b[31m" : "\x1b[32m"}[LOG] \x1b[0m${msg}`);
    }

    playSong(guild, song) {
        let queue = this.queue.get(guild.id);
        if (!song) {
            queue.voiceChannel.leave();
            this.queue.delete(guild.id);
            return;
        }
        const dispatcher = queue.connection.play(ytdl(song.url, {
          filter: "audioonly",
          highWaterMark: 1<<25
        }), {highWaterMark: 1})
        dispatcher.on('finish', async(reason) => {

            // Loop Queue
            if (queue.loopqueue.active) {
              queue.loopqueue.index += 1;
              if(queue.loopqueue.index - 1 >= queue.songs.length) queue.loopqueue.index = 1;
              this.playSong(guild, queue.songs[queue.loopqueue.index - 1]); 
              
            } else if(queue.replay) {
              this.playSong(guild, queue.songs[0]);
              queue.replay = false;
            } else {
              // LOOP
              if(!queue.loop) queue.songs.shift();
              this.playSong(guild, queue.songs[0]);
              
            }
        })
        dispatcher.on('error', error => console.error(error));
        dispatcher.setVolumeLogarithmic(queue.volume);
    }
    async addSongQueue(video, message, voiceChannel, isList = false) {
        let queue = this.queue.get(message.guild.id);

        let song = {
            author: message.author.id,
            id: video.videoId,
            title: escapeMarkdown(video.title),
            url: `https://www.youtube.com/watch?v=${video.videoId}`,
            thumbnail: video.thumbnail,
            image: video.image,
            duration: video.duration.timestamp
        };

        if (!queue) {
            const queueConstruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 0.8,
                playing: true,
                loop: false,
                replay: false,
                loopqueue: {
                  active: false,
                  index: 0
                }
            };
            client.queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song)

            let embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(`🎵 » Se a comenzado a reproducir: [${video.title.substring(0, 27)}](${video.url}) \n\n⏰ ● Duración: \`${video.timestamp}\``)
                .setColor(0x6666ff)
                .setThumbnail(video.thumbnail)

            if(!isList) queueConstruct.textChannel.send(embed)

            queueConstruct.connection = await voiceChannel.join();;
            this.playSong(message.guild, queueConstruct.songs[0]);
        } else {
           queue.songs.push(song);
              let embed = new MessageEmbed()
              .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(`🎵 » [${video.title.substring(0, 30)}](${video.url}) A sido agregada a la cola\n\n⏰ ● Duración: \`${video.timestamp}\`\n📤 ● Agregado por: <@${message.author.id}>\n⏳ ● Posicion: ${(queue.songs.length - 1) == 1 ? 'Siguiente' : queue.songs.length - 1 + '°'}`)
                .setThumbnail(video.thumbnail)
                .setColor(0x6666ff);
              if(!isList) message.channel.send(embed);
        }
    }
})();


// Inicio
client.on("ready", () => {
    client.log("Bot Listo! Iniciado como " + client.user.tag);
  
  let estados = ['El prefijo por defecto es h/', 'Si quieres ver los comandos del bot es h/comandos']

    setInterval(() => {
        client.user.setPresence({
            status: "online",
            activity: {
                name: `${estados[Math.floor(Math.random() * estados.length)]}`,
                type: "PLAYING"
            }
        });
    }, 10000)
});

// Controlador de Comandos
client.on("message", async (msg) => {
    if (msg.author.bot) return;
    if (msg.channel.type === "dm") return;
    let prefix = prefixsDB.tiene(`${msg.guild.id}`) ? await prefixsDB.obtener(`${msg.guild.id}`) : process.env.botPrefix;
    if (!msg.content.startsWith(prefix)) return;
    let args = msg.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    msg.guild.prefix = prefix;
  
    try {
        let cmdFile = require(`./cmds/${cmd}.js`);
        if (!cmdFile) return;
        cmdFile.run(client, msg, args);
    } catch (e) {
        client.log(e.toString(), true);
    } finally {
        client.log(`${msg.author.tag} ejecutó el comando ${cmd}`);
    }
});

// Errores no procesados
process.on("unhandledRejection", (r, p) => {
    client.log(r.toString(), true);
});

// Iniciando sesión
client.login(process.env.botToken);



app.get('/', (req, res) => {
  res.send('Hello')
})