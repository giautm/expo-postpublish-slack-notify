const fetch = require('node-fetch')
const qs = require('query-string')

module.exports = ({ config, iosManifest, url }) => {
  const { botToken, chatIds, whiteList = [] } = config || {};
  const id = iosManifest.id
  const releaseChannel = iosManifest.releaseChannel || 'default';

  if (Array.isArray(whiteList) && whiteList.length > 0) {
    if (!whiteList.some(wl => wl.id == id && wl.releaseChannel === releaseChannel)) {
      return 'Skip post notification';
    }
  }

  const publishedUrl = qs.stringifyUrl({
    url,
    query: releaseChannel === 'default' ? undefined : {
      'release-channel': releaseChannel,
    },
  })
  const caption = `${iosManifest.name} v${iosManifest.version} published to ${publishedUrl}`

  const photo = qs.stringifyUrl({
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
        caption,
        chat_id: chatId,
        photo,
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
