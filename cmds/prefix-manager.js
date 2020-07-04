// Required Packages
const { MessageEmbed, escapeMarkdown } = require("discord.js");
const db = require('megadb');
const djDB = new db.crearDB('djDB');

exports.run = async (client, message, args) => {

  if(!message.member.permissions.has(["MANAGE_GUILD"])) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", "¡No tienes los permisos suficientes para ejecutar este comando!")
        .setTimestamp()
        .setColor(0xff6666));
  
  let role = message.mentions.roles.first();
  if(!role) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", `¡Por favor mencione el rol que manejara la musica!\n\nUso: \`${message.guild.prefix}${require("path").basename(__filename, ".js")} <@rol>\``)
        .setTimestamp()
        .setColor(0xff6666));
  
  message.channel.send(`El rol que manejara la musica sera: ${role}`)
  djDB.establecer(`${message.guild.id}`, role.id)

}

