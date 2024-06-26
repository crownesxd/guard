function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const Bot = require("../../structures/Bot");
const Event = require("../../structures/Event");
const logger = require('node-color-log');
const Config = require("../../../Config.json");

module.exports = class GuildBotAddEvent extends Event {
  constructor(bot = Bot) {
    super(bot, "guildMemberAdd");
  }

  exec(bot = Bot, member) {
    return _asyncToGenerator(function* () {
      if (!member.user.bot) return;
    
      const entry = yield bot.util.getAuditLogs(member.guild, "BOT_ADD", function (entries) {
        return entries.target.id === member.id || entries.createdTimestamp < (Date.now() - 5000);
      });
      if (!entry || (yield bot.util.secureIds(entry.executor.id))) return;

      bot.util.catchUsers(member.guild, entry.executor.id);
      bot.util.catchUsers(member.guild, member.id);
      logger.warn(`${entry.executor.tag} sunucuya bot ekledi, botu banlayıp işlemi yapan kişiyi sunucudan banladım.`);
      const message = `🛡️ (\`${entry.executor.tag}\`), isimli kullanıcı sunucuya bot ekledi, botu banlayıp işlemi yapan kişiyi sunucudan banladım.`;

      const guardLogChannel = channel.guild.channels.cache.get(Config.GuardLog);
      if (guardLogChannel) {
        guardLogChannel.send(message);
      } else {
        logger.error('Guard Log kanalı bulunamadı!');
      }
    })();
  }
};