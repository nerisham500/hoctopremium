// Required Packages
const { MessageEmbed, escapeMarkdown } = require("discord.js");

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

	queue.connection.dispatcher.pause();
  message.channel.send("🎵 La reproduccion de musica se a pausado en este servidor!")

}

