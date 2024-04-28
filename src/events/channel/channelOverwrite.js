function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const Bot = require("../../structures/Bot");
const Event = require("../../structures/Event");
const logger = require('node-color-log');
const Config = require("../../../Config.json");

module.exports = class ChannelOverwriteUpdateEvent extends Event {
  constructor(bot = Bot) {
    super(bot, "channelUpdate");
  }

  exec(bot = Bot, oldChannel, newChannel) {
    return _asyncToGenerator(function* () {
      const entry = yield bot.util.getAuditLogs(newChannel.guild, "CHANNEL_OVERWRITE_UPDATE", function (entries) {
        return entries.target.id === newChannel.id || entries.createdTimestamp < (Date.now() - 5000);
      });
      if (!entry || (yield bot.util.secureIds(entry.executor.id))) return;

      bot.util.catchUsers(newChannel.guild, entry.executor.id);
      yield newChannel.edit({
        permissionOverwrites: oldChannel.permissionOverwrites.cache
      })
      logger.warn(`${entry.executor.tag} bir kanal güncelledi ve kanalı eski haline getirip o kişiyi sunucudan banladım!`);
      const message = `🛡️ (\`${entry.executor.tag}\`), isimli kullanıcı bir kanal güncelledi ve kanalı eski haline getirip o kişiyi sunucudan banladım!`;

      const guardLogChannel = channel.guild.channels.cache.get(Config.GuardLog);
      if (guardLogChannel) {
        guardLogChannel.send(message);
      } else {
        logger.error('Guard Log kanalı bulunamadı!');
      }
    })();
  }
};