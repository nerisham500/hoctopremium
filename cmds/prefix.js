// Required Packages
const { MessageEmbed, escapeMarkdown } = require("discord.js");
const db = require('megadb');
const prefixsDB = new db.crearDB('prefixsDB');
const djDB = new db.crearDB('djDB');

exports.run = async (client, message, args) => {

  if(!djDB.tiene(`${message.guild.id}`)) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", "¡No se a establecido un rol DJ en este servidor, intenta user el comando `prefix-manager` para establecerlo!")
        .setTimestamp()
        .setColor(0xff6666));
  if(!message.member.roles.cache.get(await djDB.obtener(`${message.guild.id}`))) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", "¡No tienes los permisos suficientes para ejecutar este comando!")
        .setTimestamp()
        .setColor(0xff6666));
  if(!args[0]) return message.channel.send(`El prefix actual del servidor es: ${message.guild.prefix}`);
  
  message.channel.send(new MessageEmbed()
            .addField("Prefix Cambiado", `El prefix del servidor a cambiado para: ${args[0]}`)
            .setTimestamp()
            .setColor(0x66ff66));
  prefixsDB.establecer(`${message.guild.id}`, args[0])
}

