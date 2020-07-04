// Required Packages
const { MessageEmbed, escapeMarkdown } = require("discord.js");
const fs = require('fs');

exports.run = async (client, message, args) => {

  let files = []
  for (const file of fs.readdirSync(`./cmds/`)) {
        if (!file.endsWith(".js")) continue;
        files.push(file.replace('.js', ''))
    }
  
  message.channel.send(new MessageEmbed().setAuthor(message.author.username, message.author.displayAvatarURL())
                      .setTitle("Lista de comandos disponibles")
                      .setDescription(`\`${files.join(", ")}\``)
                      .setTimestamp()
                      .setColor(0x6666ff))
}

