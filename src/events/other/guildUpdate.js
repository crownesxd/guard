function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const Bot = require("../../structures/Bot");
const Event = require("../../structures/Event");
const logger = require('node-color-log');
const Config = require("../../../Config.json");

module.exports = class GuildUpdateEvent extends Event {
  constructor(bot = Bot) {
    super(bot, "guildUpdate");
  }

  exec(bot = Bot, oldGuild, newGuild) {
    return _asyncToGenerator(function* () {
      if (oldGuild.banner === newGuild.banner && oldGuild.icon === newGuild.icon && oldGuild.name === newGuild.name) return;

      const entry = yield bot.util.getAuditLogs(newGuild, "GUILD_UPDATE", function (entries) {
        return entries.target.id === newGuild.id || entries.createdTimestamp < (Date.now() - 5000);
      });
      if (!entry || (yield bot.util.secureIds(entry.executor.id))) return;

      bot.util.catchUsers(newGuild, entry.executor.id);
      
      yield newGuild.edit({
        name: oldGuild.name,
        icon: oldGuild.iconURL({ dynamic: true }),
        banner: oldGuild.bannerURL()
      });
      
      logger.warn(`${entry.executor.tag} sunucuyu güncelledi, sunucuyu eski haline getirdim ve işlemi yapan kişiyi sunucudan banladım.`);
      const message = `🛡️ (\`${entry.executor.tag}\`), isimli kullanıcı sunucuyu güncelledi, sunucuyu eski haline getirdim ve işlemi yapan kişiyi sunucudan banladım.`;

      const guardLogChannel = oldGuild.channels.cache.get(Config.GuardLog);
      if (guardLogChannel) {
        guardLogChannel.send(message);
      } else {
        logger.error('Guard Log kanalı bulunamadı!');
      }
    })();
  }
};