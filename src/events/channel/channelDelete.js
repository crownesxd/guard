function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const Bot = require("../../structures/Bot");
const Event = require("../../structures/Event");
const logger = require('node-color-log');
const Config = require("../../../Config.json");

module.exports = class ChannelDeleteEvent extends Event {
  constructor(bot = Bot) {
    super(bot, "channelDelete");
  }

  exec(bot = Bot, channel) {
    return _asyncToGenerator(function* () {
      const entry = yield bot.util.getAuditLogs(channel.guild, "CHANNEL_DELETE", function (entries) {
        return entries.target.id === channel.id && entries.createdTimestamp > Date.now() - 1000 * 60;
      });
      if (!entry || (yield bot.util.secureIds(entry.executor.id))) return;

      bot.danger = true;
      bot.util.catchUsers(channel.guild, entry.executor.id);
      bot.util.cloneChannels(channel, bot.resolvers.resolveChannelType(channel.type));
      logger.warn(`${entry.executor.tag} bir kanal sildi ve kanalı oluşturup o kişiyi sunucudan banladım!`);
      const message = `🛡️ (\`${entry.executor.tag}\`), isimli kullanıcı bir kanal sildi ve kanalı oluşturup o kişiyi sunucudan banladım!`;

      const guardLogChannel = channel.guild.channels.cache.get(Config.GuardLog);
      if (guardLogChannel) {
        guardLogChannel.send(message);
      } else {
        logger.error('Guard Log kanalı bulunamadı!');
      }
    })();
  }
};