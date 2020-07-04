// Required Packages
const { MessageEmbed, escapeMarkdown } = require("discord.js");
const Weez = require('weez')
let weez = new Weez.WeezAPI(process.env.weezToken)

exports.run = async (client, message, args) => {

    if (!args[0]) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", `¡Por favor escriba el nombre de una cancion!\n\nUso: \`${message.guild.prefix}${require("path").basename(__filename, ".js")} <Nombre de la cancion>\``)
        .setTimestamp()
        .setColor(0xff6666));
  
      var song = await weez.letra(args.join(' '))
  
  if(song.mensaje) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", `¡No se pudo encontrar la letra de esa cancion!\n\nUso: \`${message.guild.prefix}${require("path").basename(__filename, ".js")} <Nombre de la cancion>\``)
        .setTimestamp()
        .setColor(0xff6666));
  
    if(song.letra.length >= 2048) {
      song.letra = cutString(song.letra)
    }
  
    let msg = await message.channel.send(new MessageEmbed().setAuthor(message.author.username, message.author.displayAvatarURL)
                        .setTitle(`Letra de ${args.join(' ').substring(0, 30)}`)
                         .setImage(song.imagen)
                        .setDescription(Array.isArray(song.letra) ? song.letra[0] : song.letra.substring(0, 2048))
                        .setColor(0x6666ff))
    
    if(Array.isArray(song.letra)) {
      let page = 0;
      await msg.react("◀️");
      await msg.react("▶️");
      let collector = msg.createReactionCollector((r, u) => ["◀️",  "▶️"].includes(r.emoji.name) && u.id === message.author.id, { time: 60000 });
      
      collector.on("collect", (r) => {
            r.users.remove(message.author)
            if (r.emoji.name === "▶️") {
                if ((page + 1) > song.letra.length - 1) return;
                page++;
                msg.edit(new MessageEmbed().setAuthor(message.author.username, message.author.displayAvatarURL)
                        .setTitle(`Letra de ${args.join(' ').substring(0, 30)}`)
                         .setImage(song.imagen)
                        .setDescription(song.letra[page])
                        .setColor(0x6666ff))
            } else if (r.emoji.name === "◀️") {
                if ((page - 1) < 0) return;
                page--;
                msg.edit(new MessageEmbed().setAuthor(message.author.username, message.author.displayAvatarURL)
                        .setTitle(`Letra de ${args.join(' ').substring(0, 30)}`)
                         .setImage(song.imagen)
                        .setDescription(song.letra[page])
                        .setColor(0x6666ff))
            }
      })
    }
} 


function cutString(string) {
  
  
  let chunks = [];
  
    for (var i = 0, charsLength = string.length; i < charsLength; i += 2048) {
      chunks.push(string.substring(i, i + 2048));
  }
  
  return chunks
}