import fs from 'fs';
import bug from "./bug.js";

async function fetch_response(url, params) {
    try {
        const response = await fetch(url, params);
        if (response.ok) {
            return await response.text();
        } else {
            return 'ERROR OCCURED';
        }
    } catch (error) {
        return 'AN ERROR OCCURED';
    }
}

async function text(prompt, systemMessage = "You are a helpful assistant named DTAMAI developped by Dtamtech(a programmer who is passionate by creating new solutions with artificial intelligence) you do not have to repeat this every time when we ask another question, just respond clearly at the question. For text parsing use Whatsapp Markdown Technology", chosenModel = 'llama') {
    return await fetch_response('https://text.pollinations.ai/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: prompt },
            ],
            model: chosenModel,
            private: true
        })
    });
}

async function respondAi(message, client, type = 'txt', model = 'llama', imgModel = 'flux') {
    const remoteJid = message.key.remoteJid;
    const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
    const commandAndArgs = messageBody.slice(1).trim();
    const args = commandAndArgs.split(/\s+/).slice(1);
    const promptText = args.join(" ");
    const imgPath = `medias/aimage/${remoteJid}.png`;

    client.sendMessage(remoteJid, { text: "> sending request" });

    if (type === 'txt') {
        const response = await text(promptText);
        client.sendMessage(remoteJid, { text: "> parsing response" });

        if (response === "ERROR OCCURED") {
            await bug(message, client, 'ERROR OCCURED', 1);
        } else if (response === 'AN ERROR OCCURED') {
            await bug(message, client, 'AN ERROR OCCURED', 3);
        } else {
            client.sendMessage(remoteJid, { text: response });
        }
    } else {
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?model=${imgModel}&nologo=true`;
        const response = await fetch_response(imageUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        client.sendMessage(remoteJid, { text: "> parsing response" });

        if (response === "ERROR OCCURED") {
            await bug(message, client, 'ERROR OCCURED', 1);
        } else if (response === 'AN ERROR OCCURED') {
            await bug(message, client, 'AN ERROR OCCURED', 3);
        } else {
            fs.writeFileSync(imgPath, response);
            client.sendMessage(remoteJid, {
                image: { url: imgPath },
                caption: `> ${promptText}`,
            });
        }
    }
}

export default respondAi;
