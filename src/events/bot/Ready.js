function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const Bot = require("../../structures/Bot");
const Event = require("../../structures/Event");
const logger = require('node-color-log');
const Config = require("../../../Config.json");

module.exports = class ReadyEvent extends Event {
  constructor(bot = Bot) {
    super(bot, "ready");
    
  }

  exec(bot = Bot) {
    return _asyncToGenerator(function* () {
      logger.success("Başarıyla bota giriş yapıldı!");
      
       bot.user.setPresence({
        activities: [{
          name: Config.Presence, 
          type: "WATCHING",
        }],
        status: "online", // Botun durumu, online, idle, dnd gibi olabilir
      });

      setInterval(_asyncToGenerator(function* () {
        if (bot.danger === false) yield bot.util.getBackup();
      }), 1000 * 60 * 30);
      logger.info("Sunucunun yedeği başarıyla alındı!");
    })();
  }
};