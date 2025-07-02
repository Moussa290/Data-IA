export default async function bug(message, client, errorText, code = 0) {
    const remoteJid = message.key.remoteJid;
    await client.sendMessage(remoteJid, { text: `❌ Erreur (${code}): ${errorText}` });
}
