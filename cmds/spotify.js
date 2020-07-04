// Required Packages
const { MessageEmbed, escapeMarkdown } = require("discord.js");
const SpotifyWebApi = require('spotify-web-api-node')
const youtube = require('yt-search');
 
const spotifyApi = new SpotifyWebApi({
  clientId: "0fbb7c22106d41d3aa591dcad22791de",
  clientSecret: "ae958bce655a4f958b00e2ab11c64bf8"
});

exports.run = async (client, message, args) => {

if (!message.member.voice.channel) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", "¡Necesitas estar en un canal de Voz!")
        .setTimestamp()
        .setColor(0xff6666));
  
  //Auth
  const TOKEN = await spotifyApi.clientCredentialsGrant()
  spotifyApi.setAccessToken(TOKEN.body.access_token)
  //Auth
  
  if(!args[0]) return message.channel.send(new MessageEmbed()
        .addField("❌ Error", `¡Por favor escriba una URL de spotify Valida!\n\nUso: \`${message.guild.prefix}${require("path").basename(__filename, ".js")} <Spotify URLL>\``)
        .setTimestamp()
        .setColor(0xff6666));
  
  let URL = args[0]
  
  if (URL.search('album') > 1) {
    await parseAlbum(client, message, getID(URL));
    return;
  }
  if (URL.search('track') > 1) {
    await addTrack(client, message, getID(URL));
    return;
  }
  if (URL.search('playlist') > 1) {
    await parsePlayList(client, message, getID(URL));
    return;
  }
  return message.channel.send(new MessageEmbed()
        .addField("❌ Error", `¡Por favor escriba una URL de spotify Valida!\n\nUso: \`${message.guild.prefix}${require("path").basename(__filename, ".js")} <Spotify URLL>\``)
        .setTimestamp()
        .setColor(0xff6666));
}

async function addTrack(client, message, ID, isList = false) {
  const data = await spotifyApi.getTrack(ID).catch(err => console.log(err))
  const TRACKDATA = {
    name: data.body.name,
    artists: [],
    url: data.body.external_urls.spotify,
    cover: data.body.album.images[0].url
  }
  data.body.artists.map(artist => TRACKDATA.artists.push(artist.name))
  const query = `${ TRACKDATA.name } ${ TRACKDATA.artists.join(', ') }`
  let { videos } = await youtube(query)
  await client.addSongQueue(videos[0], message, message.member.voice.channel, isList ? true : false)
}

async function parseAlbum(client, message, ID) {
  const data = await spotifyApi.getAlbum(ID).catch(err => console.log(err))
  data.body.tracks.items.map(e => addTrack(client, message, e.id, true))
  let embed = new MessageEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`🎵 » Las canciones del album **${data.body.name}** han sido agregadas\n\n⏰ Total de canciones: ${data.body.tracks.total}`)
    .setThumbnail(data.body.images[0].url)
    .setColor(0x6666ff);
  message.channel.send(embed)
}

async function parsePlayList(client, message, ID) {
  const data = await spotifyApi.getPlaylist(ID, { pageSize: 10, limit: 10 }).catch(err => console.log(err))
  data.body.tracks.items.map(e => addTrack(client, message, e.track.id, true))
  let embed = new MessageEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL())
    .setDescription(`🎵 » Las canciones de la playlist **${data.body.owner.display_name}** han sido agregadas\n\n⏰ Total de canciones: ${data.body.tracks.total}`)
    .setThumbnail(data.body.images[0].url)
    .setColor(0x6666ff);
  message.channel.send(embed)
}

function getID(url) {
  const URL = url.substring(url.search(/(album).|(track).|(playlist)./g), url.length)
  return URL.substring(URL.search('/') + 1, URL.length)
}