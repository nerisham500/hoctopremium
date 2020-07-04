// Required Packages
const { MessageEmbed, escapeMarkdown } = require("discord.js"),
    YouTube = require('simple-youtube-api'),
    ytdl = require('ytdl-core'),
    youtube = new YouTube("AIzaSyDaHAsZ-7uLiVSt2XXa9o5-9wHa3eQVHSw");

const Utils = require('../functions.js')

exports.run = async (client, message, args) => {

    let queue = client.queue.get(message.guild.id);
    if(!queue) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", "¡El bot no esta actualmente reproduciendo musica!")
        .setTimestamp()
        .setColor(0xff6666));
    if (!message.member.voice.channel || message.member.voice.channel.id != queue.voiceChannel.id) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", "¡Necesitas estar en un canal de Voz o en el mismo en el que esta el Bot!")
        .setTimestamp()
        .setColor(0xff6666));
  
    if(!args[0] || isNaN(args[0])) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", `¡Porfavor proporcione la posicion que usted quiere remover!\n\n\`${message.guild.prefix}${require("path").basename(__filename, ".js")} <posicion> \``)
        .setTimestamp()
        .setColor(0xff6666));
  
    if(queue.songs.length == 1) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", `¡No se puede eliminar la cancion de la cola debido a que es la unica!`)
        .setTimestamp()
        .setColor(0xff6666));
    
  let songs = queue.songs;
  
  let position = (pos, songsLength) => {
    // 6 >= 1
    if(pos > songsLength) {
      return false
    // 1 < 2
    } else if (pos < songs.lenth) {
     return false
    } else return pos
  }
  
  if(!position(args[0], songs.length)) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", "¡No existe esa posicion en la cola de reproduccion!")
        .setTimestamp()
        .setColor(0xff6666));
  
  let video = queue.songs[position(args[0], songs.length)]
	let embed = new MessageEmbed()
              .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(`🎵 » [${video.title.substring(0, 30)}](${video.url}) A sido eliminada de la cola de reproduccion`)
                .setThumbnail(video.thumbnail)
                .setColor(0x66ffff);
  
  queue.songs.splice(position(args[0], songs.length), 1)
  message.channel.send(embed)
  console.log(queue.songs)

}

