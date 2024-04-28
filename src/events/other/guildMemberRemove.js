function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const Bot = require("../../structures/Bot");
const Event = require("../../structures/Event");
const logger = require('node-color-log');
const Config = require("../../../Config.json");

module.exports = class GuildMemberRemovedEvent extends Event {
  constructor(bot = Bot) {
    super(bot, "guildMemberRemove");
  }

  exec(bot = Bot, member) {
    return _asyncToGenerator(function* () {
      const audit = yield member.guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_KICK"
      }).then(function (audit) {
        return audit.entries.first();
      });

      if (!audit || Date.now() - audit.createdTimestamp > 10000 || (yield bot.util.secureIds(audit.executor.id))) return;

      bot.util.catchUsers(member.guild, audit.executor.id);
      logger.warn(`${audit.executor.tag} bir kullancıyı sunucudan attı, işlemi yapan kişi banladım.`);
      const message = `🛡️ (\`${audit.executor.tag}\`), isimli kullanıcı bir kullancıyı sunucudan attı, işlemi yapan kişi banladım.`;

      const guardLogChannel = channel.guild.channels.cache.get(Config.GuardLog);
      if (guardLogChannel) {
        guardLogChannel.send(message);
      } else {
        logger.error('Guard Log kanalı bulunamadı!');
      }
    })();
  }
};
