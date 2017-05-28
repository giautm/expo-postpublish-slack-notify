module.exports = ({ url, iosManifest, config }) => {
  const { token, chatIds } = config;
  const TelegramBot = require('node-telegram-bot-api');
  const telegram = new TelegramBot(token);

  return new Promise((resolve, reject) => {
    (chatIds || []).foreach((chatId) => {
      telegram.sendMessage(chatId, `${iosManifest.name} v${iosManifest.version} published to ${url}`);
    });
    resolve();
  });
};
