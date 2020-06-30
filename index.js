module.exports = ({ url, iosManifest, config }) => {
  const { botToken, chatIds } = config;
  const fetch = require('node-fetch');
  const qs = require('query-string')
  const releaseChannel = iosManifest.releaseChannel || 'default';
  const publishedUrl = qs.stringifyUrl({
    url,
    query: releaseChannel === 'default' ? undefined : {
      'release-channel': releaseChannel,
    },
  })
  const qrUrl = qs.stringifyUrl({
    url: 'https://api.qrserver.com/v1/create-qr-code',
    query: {
      data: publishedUrl,
      size: '250x250',
    }
  })

  return Promise.all((chatIds || []).map((chatId) => {
    return fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        photo: qrUrl,
        caption: `${iosManifest.name} v${iosManifest.version} published to ${publishedUrl}`,
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
