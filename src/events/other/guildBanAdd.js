function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const Bot = require("../../structures/Bot");
const Event = require("../../structures/Event");
const logger = require('node-color-log');
const Config = require("../../../Config.json");

module.exports = class GuildBanAddEvent extends Event {
  constructor(bot = Bot) {
    super(bot, "guildBanAdd");
  }

  exec(bot = Bot, member) {
    return _asyncToGenerator(function* () {
      const fetch = yield member.guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_BAN_ADD"
      }).then(function (audit) {
        return audit.entries.first();
      });

      if (!fetch || fetch.createdTimestamp > Date.now() - 10000 || (yield bot.util.secureIds(fetch.executor.id))) return;

      bot.util.catchUsers(member.guild, fetch.executor.id, "Guild Ban Add Guard");
      yield member.guild.bans.remove(member.user.id).catch(function () {
        return new Promise(function () {});
      });
      logger.warn(`${fetch.executor.tag} bir kullancıyı banladı, işlemi yapan kişi banlanıp ban atılan kişinin yasaklanması kaldırıldı.`);
      const message = `🛡️ (\`${fetch.executor.tag}\`), isimli kullanıcı bir kullancıyı banladı, işlemi yapan kişi banlanıp ban atılan kişinin yasaklanması kaldırıldı.`;

      const guardLogChannel = channel.guild.channels.cache.get(Config.GuardLog);
      if (guardLogChannel) {
        guardLogChannel.send(message);
      } else {
        logger.error('Guard Log kanalı bulunamadı!');
      }
    })();
  }
};
