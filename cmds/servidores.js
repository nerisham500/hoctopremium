// Required Packages
const { MessageEmbed, escapeMarkdown } = require("discord.js");

exports.run = async (client, message, args) => {
  
 if(!["556865853996531714"].includes(message.author.id)) return message.channel.send('(Este comando se puede utilizar en el bot básico)Este comando solo lo puede usar el programador o autorizados.')
  message.channel.send(new MessageEmbed().setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription(client.guilds.cache.map(guild => `${guild.name} - ${guild.memberCount}`).join('\n'))
            .setTitle('Lista de servidores')
            .setTimestamp()
            .setColor(0x66ff66));
}

