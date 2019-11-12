module.exports = ({ url, iosManifest, config }) => {
  const { botToken, chatIds } = config;
  const fetch = require('node-fetch');

  const releaseChannel = iosManifest.releaseChannel || 'default';
  const queryString = releaseChannel === 'default' ? '' :
    '?release-channel='+encodeURIComponent(releaseChannel);

  const dataStr = encodeURIComponent(`${url}${queryString}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${dataStr}`;

  return Promise.all((chatIds || []).map((chatId) => {
    return fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        photo: qrUrl,
        caption: `${iosManifest.name} v${iosManifest.version} published to ${dataStr}`,
      }),
    }).then((response) => response.json()).then((data) => {
      if (data.ok) {
        return data.result;
      } else {
        return Promise.reject(
          new Error(`${data.error_code} - ${data.description}`));
      }
    });
  })).then(() => 'Posted notification to Telegram!');
};
