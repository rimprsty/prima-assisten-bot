import { isJidGroup } from 'baileys';

const COMPLAINT_GROUP_JID = '120363407082641884@g.us';

const COMPLAINT_KEYWORDS = [
  'keluhan',
  'komplain', 
  'masalah',
  'error',
  'gagal',
  'tidak bisa',
  'jelek',
  'buruk',
  'kecewa',
  'protes'
];

const AUTO_REPLY_MESSAGES = {
  greeting: 'Terima kasih telah menghubungi kami. Pesan Anda telah kami terima dan akan segera kami balas oleh tim customer service kami. 🙏',
  greeting_en: 'Thank you for contacting us. Your message has been received and will be responded to by our customer service team shortly. 🙏'
};

export default class PrimaAssisten {
  constructor(sock, store) {
    this.sock = sock;
    this.store = store;
    this.name = 'prima-assisten';
    this.description = 'WhatsApp Assistant untuk Customer Service';
    this.version = '1.0.0';
  }

  async onMessage(message) {
    const { from, body, isGroup } = message;

    if (isGroup) return;

    const isComplaint = this.detectComplaint(body);

    await this.sendAutoReply(from);

    if (isComplaint) {
      await this.forwardToComplaintGroup(message);
    }
  }

  detectComplaint(messageBody) {
    const lowerBody = messageBody.toLowerCase();
    return COMPLAINT_KEYWORDS.some(keyword => 
      lowerBody.includes(keyword)
    );
  }

  async sendAutoReply(jid) {
    try {
      await this.sock.sendMessage(jid, {
        text: AUTO_REPLY_MESSAGES.greeting
      });
    } catch (error) {
      console.error(`Error sending auto-reply to ${jid}:`, error);
    }
  }

  async forwardToComplaintGroup(message) {
    try {
      const { from, body, timestamp } = message;
      const senderName = message.pushName || from;
      const formattedTime = new Date(timestamp * 1000).toLocaleString('id-ID');

      const complaintMessage = `
⚠️ KELUHAN BARU

👤 Dari: ${senderName} (${from})
📝 Pesan: ${body}
🕐 Waktu: ${formattedTime}
      `.trim();

      await this.sock.sendMessage(COMPLAINT_GROUP_JID, {
        text: complaintMessage
      });

      console.log(`✅ Keluhan dari ${senderName} berhasil diteruskan ke grup`);
    } catch (error) {
      console.error('Error forwarding complaint to group:', error);
    }
  }
}
