// backend/services/TelegramService.js

const axios = require("axios");

class TelegramService {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;

    if (!this.botToken || !this.chatId) {
      console.error("❌ Telegram ENV missing!");
    }

    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendMessage(message, phone = null) {
    try {
      if (!this.botToken || !this.chatId) {
        throw new Error("Telegram config missing in .env");
      }

      const url = `${this.baseUrl}/sendMessage`;

      // ✅ Base payload
      const payload = {
        chat_id: this.chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      };

      // ✅ WhatsApp Button
      if (phone) {
        let formattedPhone = phone.replace(/\D/g, "");
        if (formattedPhone.startsWith("0")) {
          formattedPhone = "92" + formattedPhone.substring(1);
        }

        const orderIdMatch = message.match(/Order ID: ([A-Z0-9-]+)/);
        const orderId = orderIdMatch ? orderIdMatch[1] : "";

        const whatsappMessage = encodeURIComponent(
          `Assalam-o-Alaikum! ❤️%0A%0AThank you for your order from Karachi Clothes!%0A%0A📋 Order ID: ${orderId}%0A%0AWe will contact you shortly for confirmation.%0A%0A🌐 https://karachi-clothes.vercel.app`,
        );

        // ✅ Inline Keyboard
        const replyMarkup = {
          inline_keyboard: [
            [
              {
                text: "💬 Chat on WhatsApp",
                url: `https://wa.me/${formattedPhone}?text=${whatsappMessage}`,
              },
            ],
            [
              {
                text: "📞 Call Customer",
                url: `tel:${formattedPhone}`,
              },
            ],
          ],
        };

        payload.reply_markup = JSON.stringify(replyMarkup);
      }

      // ✅ Send to Telegram
      const response = await axios.post(url, payload, {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Message sent with button!");

      return {
        success: true,
        messageId: response.data?.result?.message_id,
      };
    } catch (error) {
      console.error("❌ Telegram Error:", error.message);
      console.error("📝 Response:", error.response?.data);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  formatOrderMessage(order) {
    const customer = order.customer || {};
    const items = order.items || [];

    let message = `🛍️ <b>NEW ORDER - KARACHI CLOTHES</b>\n\n`;

    message += `📋 Order ID: ${order.orderId}\n`;
    message += `🕐 Time: ${new Date(order.createdAt).toLocaleString()}\n\n`;

    message += `👤 <b>Customer:</b>\n`;
    message += `Name: ${customer.name || "N/A"}\n`;
    message += `Phone: ${customer.phone || "N/A"}\n`;
    message += `Address: ${customer.address || "N/A"}\n`;
    message += `City: ${customer.city || "N/A"}\n`;

    if (customer.notes) {
      message += `Notes: ${customer.notes}\n`;
    }

    message += `\n📦 <b>Items:</b>\n`;
    message += `-----------------\n`;

    items.forEach((item, i) => {
      message += `${i + 1}. ${item.name || "Item"}\n`;
      message += `Qty: ${item.quantity || 1}\n`;
      message += `Price: Rs. ${item.price * item.quantity || 0}\n\n`;
    });

    message += `-----------------\n`;
    message += `💰 <b>Total: Rs. ${order.totalAmount || 0}</b>\n\n`;
    message += `Thank you for shopping ❤️`;

    return message;
  }

  async sendOrderNotification(order) {
    const message = this.formatOrderMessage(order);
    return await this.sendMessage(message, order.customer.phone);
  }
}

module.exports = new TelegramService();
