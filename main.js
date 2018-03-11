const TelegramBot = require('node-telegram-bot-api');
const Cron = require('cron');
const token = '522894086:AAE4iZaJ--8yBJ5dj7nUQE9kQPB6TPo8Rq8';
const bot = new TelegramBot(token, {polling: true});
const timeFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
let msg_time = {'uid': -1, 'time': "0:00"};
const fs = require('fs'),
    path = require('path');
//Bot part
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Добро пожаловать!");
    bot.sendMessage(msg.chat.id, "Скажите, во сколько вы ежедневно хотите получать сообщения?", {
        "reply_markup": {
            "keyboard": [["23:00"], ["23:30"], ["0:00"], ["0:30"]]
        }
    });
});

bot.onText(/\/settime/, (msg) => {
    bot.sendMessage(msg.chat.id, "Во сколько вы ежедневно хотите получать сообщения?", {
        "reply_markup": {
            "keyboard": [["23:00"], ["23:30"], ["0:00"], ["0:30"]]
        }
    });
});

bot.on('message', (msg) => {
    var new_time = msg.text.toString();
    if (timeFormat.test(new_time)) {
        if (new_time.startsWith("0")) {
            new_time = new_time.substring(1);
        }
        msg_time = {'uid': msg.chat.id, 'time': new_time};
        console.log("Сообщения будут присылаться в " + msg_time['time'] + " пользователю: " + msg_time['uid']);
        bot.sendMessage(msg.chat.id, "Сообщения будут присылаться в " + msg_time['time']);
    }
    else {
        bot.sendMessage(msg.chat.id, "Введите корректное время")
    }
});


function getTextForDate() {
    let date = new Date().toLocaleString('ru', {
        month: 'long',
        day: 'numeric'
    });
    date = date.replace(' ', ' ');
    console.log(date);
    const filePath = path.join(__dirname, "./texts/Days/" + date + ".json");

    return date + ":\n" + fs.readFileSync(filePath, {encoding: 'utf-8'});
}


const job = new Cron.CronJob({
    cronTime: '01 * * * * *',
    onTick: function () {
        if (msg_time['uid'] != -1) {

            var curDate = new Date().getHours() + ':' + new Date().getMinutes();
            if (msg_time['time'] === curDate) {
                bot.sendMessage(msg_time['uid'], "Test2");
                bot.sendMessage(msg_time['uid'], getTextForDate());
                console.log('Сообщение отправлено в ' + msg_time['time'])
            }
            console.log(msg_time['uid'], "Test, curDate = " + curDate + " msg_time = " + msg_time['time'])
            bot.sendMessage(msg_time['uid'], "Test1");
        }
    },
    start: true
});

job.start();