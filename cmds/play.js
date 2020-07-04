// Required Packages
const { MessageEmbed, escapeMarkdown } = require("discord.js"),
    youtube = require('yt-search');

exports.run = async (client, message, args) => {


    if (!message.member.voice.channel) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", "¡Necesitas estar en un canal de Voz!")
        .setTimestamp()
        .setColor(0xff6666));

    if (!args[0]) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", `¡Por favor escriba el nombre de una cancion o una URL Valida!\n\nUso: \`${message.guild.prefix}${require("path").basename(__filename, ".js")} <Nombre de la cacion o URL>\``)
        .setTimestamp()
        .setColor(0xff6666));

    let botPermissions = message.member.voice.channel.permissionsFor(message.client.user).toArray();
    if (!botPermissions.includes('CONNECT')) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", "¡No tengo el permiso necesario para conectarme al canal de Voz!")
        .setTimestamp()
        .setColor(0xff6666));
    if (!botPermissions.includes('SPEAK')) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", "¡No tengo el permiso necesario para hablar en el canal de Voz!")
        .setTimestamp()
        .setColor(0xff6666));

    let search = args.slice(0).join(' ');
        let { videos } = await youtube(search)

        let embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle("Hemos encontrado estos resultados:")
        .setDescription(`${videos.slice(0, 10).map((video, i) => `> **${i + 1}** | ${escapeMarkdown(video.title)}`).join('\n')}\n\nProporcione un numero del 1 al 10`)
        .setColor(0x6666ff)
        message.channel.send(embed)
        let answer = await message.channel.awaitMessages(msg => parseInt(msg.content) && parseInt(msg.content) <= 10, { max: 1, time: 20000, errors: ['time'] })
        let video = await videos[parseInt(answer.first().content) - 1]
        await client.addSongQueue(video, message, message.member.voice.channel)

}

