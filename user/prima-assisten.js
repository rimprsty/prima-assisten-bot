// prima-assisten.js

// WhatsApp Assistant Plugin
// Auto-replies to private messages and forwards complaints to a group

const WhatsAppAPI = require('whatsapp-api');

class PrimaAssisten {
    constructor() {
        this.autoReplyMessage = "Thank you for your message! We will get back to you shortly.";
        this.complaintGroupId = 'group-chat-id'; // Replace with actual group chat ID
    }

    onPrivateMessage(message) {
        this.autoReply(message);
        if (this.isComplaint(message)) {
            this.forwardToGroup(message);
        }
    }

    autoReply(message) {
        WhatsAppAPI.sendMessage(message.from, this.autoReplyMessage);
    }

    isComplaint(message) {
        const complaintKeywords = ['complaint', 'issue', 'problem'];
        return complaintKeywords.some(keyword => message.body.toLowerCase().includes(keyword));
    }

    forwardToGroup(message) {
        const forwardedMessage = `Complaint from ${message.from}: ${message.body}`;
        WhatsAppAPI.sendMessage(this.complaintGroupId, forwardedMessage);
    }
}

module.exports = PrimaAssisten;