import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import respondAi from './respondAi.js';

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on('qr', (qr) => {
    console.log('📱 Scanne ce QR code avec WhatsApp :');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot connecté à WhatsApp !');
});

client.on('message', async (message) => {
    const content = message.body.toLowerCase();

    if (content.startsWith('/ask')) {
        await respondAi(message, client, 'txt');
    }

    if (content.startsWith('/img')) {
        await respondAi(message, client, 'img');
    }
});

client.initialize();
