// Required Packages
const { MessageEmbed, escapeMarkdown } = require("discord.js");

exports.run = async (client, message, args) => {

    let queue = client.queue.get(message.guild.id);
    if(!queue) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", "¡El bot no esta actualmente reproduciendo musica!")
        .setTimestamp()
        .setColor(0xff6666));
  
    let queueSongs = queue.songs.slice(1).map(song => `${song.title.substring(0, 38)} | Agregado por <@${song.author}>`)
    if(!queueSongs) queueSongs = []
  
    message.channel.send(new MessageEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setTitle(`Lista de reproduccion de ${message.guild.name}`)
                        .setDescription(`➡️ Reproduciendo ⬅️\n${queue.songs[0].title} | \`${queue.songs[0].duration}\`\n\n⏬ En cola ⏬\n${queueSongs.slice(0, 9).join("\n")}`)
                        .setColor(0x6666ff))
  
    

}

