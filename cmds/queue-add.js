// Required Packages
const { MessageEmbed, escapeMarkdown } = require("discord.js"),
    youtube = require('yt-search');
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
        .addField("❌ Error", `¡Porfavor proporcione la posicion en la que quiere agregar la cancion!\n\n\`${message.guild.prefix}${require("path").basename(__filename, ".js")} <posicion> <nombre de cancion>\``)
        .setTimestamp()
        .setColor(0xff6666));

  let search = args.slice(1).join(" ")
  
    if(!args[1] || search.length <= 0) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", `¡Porfavor proporcione el nombre de la que cancion!\n\n\`${message.guild.prefix}${require("path").basename(__filename, ".js")} <posicion> <nombre de cancion>\``)
        .setTimestamp()
        .setColor(0xff6666));
  
    let { videos } = await youtube(search)
    let video = videos[0]
  
    let song = {
            author: message.author.id,
            id: video.videoId,
            title: escapeMarkdown(video.title),
            url: `https://www.youtube.com/watch?v=${video.videoId}`,
            thumbnail: video.thumbnail,
            image: video.image,
            duration: video.duration.timestamp
        };
  
  let songs = queue.songs;
  
  let position = (pos, songsLength) => {
    // 6 >= 1
    if(pos >= songsLength) {
      return songsLength + 1
    // 1 < 2
    } else if (pos < songs.lenth) {
     return songsLength + 1
    } else return pos
  }
  
  songs.splice(position(args[0], songs.length), 0, song);
	let embed = new MessageEmbed()
              .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(`🎵 » [${video.title.substring(0, 30)}](${video.url}) A sido agregada a la cola\n\n⏰ ● Duración: \`${video.timestamp}\`\n📤 ● Agregado por: <@${message.author.id}>\n⏳ ● Posicion: ${(queue.songs.length - 1) == 1 ? 'Siguiente' : queue.songs.length - 1 + '°'}`)
                .setThumbnail(video.thumbnail)
                .setColor(0x6666ff);
              message.channel.send(embed);

}

