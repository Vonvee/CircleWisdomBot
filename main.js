const TelegramBot = require('node-telegram-bot-api');
const token = '522894086:AAE4iZaJ--8yBJ5dj7nUQE9kQPB6TPo8Rq8';
const bot = new TelegramBot(token, {polling: true});
var timeFormat      = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
var msg_time = {'uid': -1, 'time': "0:00"};
//Bot part
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Добро пожаловать!")
    bot.sendMessage(msg.chat.id, "Скажите, во сколько вы ежедневно хотите получать сообщения?",{
        "reply_markup": {
            "keyboard": [["23:00"],["23:30"],["0:00"],["0:30"]]
        }
    });
});

bot.onText(/\/settime/, (msg) => {
    bot.sendMessage(msg.chat.id, "Во сколько вы ежедневно хотите получать сообщения?",{
        "reply_markup": {
            "keyboard": [["23:00"],["23:30"],["0:00"],["0:30"]]
        }
    });
});

bot.on('message', (msg) => {
    var new_time = msg.text.toString()
    if(timeFormat.test(new_time)) {
        if(new_time.startsWith("00")){
            new_time = new_time.substring(1);
        }
        msg_time = {'uid': msg.chat.id, 'time': new_time};
        console.log("Сообщения будут присылаться в "+msg_time['time']+" пользователю:"+ msg_time['uid'])
        bot.sendMessage(msg.chat.id, "Сообщения будут присылаться в " + msg_time['time']);
    }
    else{
        bot.sendMessage(msg.chat.id,"Введите корректное время")
    }
});

function getTextForDate() {
    var date = new Date().toLocaleString('ru', {
        month: 'long',
        day: 'numeric'
    });
    date = date.replace(' ', ' ');
    console.log(date);
    var fs = require('fs'),
        path = require('path'),
        filePath = path.join(__dirname, "./texts/Days/" + date + ".json");
    fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
        if (!err) {
            //console.log(data);
            return data;
            //response.writeHead(200, {'Content-Type': 'text/html'});
            //response.write(data);
            //response.end();
        } else {
            console.log(err);
            return data;
        }
    });
}

setInterval(function () {
        var curDate = new Date().getHours() + ':' + new Date().getMinutes();
        if (msg_time['time'] === curDate) {
            bot.sendMessage(msg_time['uid'], '1. Разговоры о великом');
            console.log(msg_time['time'] )
        }
}, 60000);