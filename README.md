# expo-postpublish-telegram-notify

Post a notification on Telegram whenever your project is published.
Presumably you already know this is happening so it's probably more
useful to non-you people, such as your team or your grandparents.

## Installation

1. [Create an Telegram's bot](https://core.telegram.org/bots#6-botfather).
2. `yarn add expo-postpublish-telegram-notify` in your project.
3. Add the following to your `exp.json`
4. Start chat with bot via command `/start`. If not, you will receive an error `400 - Bad Request: chat not found`.

```javascript
  "hooks": {
    "postPublish": [
      {
        "file": "expo-postpublish-telegram-notify",
        "config": {
          "botToken": "YOUR BOT TOKEN FROM BOT FATHER",
          "chatIds": [
          ]
        }
      }
    ]
  }
```
