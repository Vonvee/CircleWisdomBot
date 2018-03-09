function getTextForDate() {
    var date = new Date().toLocaleString('ru', {
        month: 'long',
        day: 'numeric'
    });
    date = date.replace(' ', ' ');
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

console.log(getTextForDate());