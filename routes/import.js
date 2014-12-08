var CardModel = require('../models/game').Card;
var GameModel = require('../models/game').Game;

exports.importAction = function (req, res) {
    res.render('import');
};

exports.importPostAction = function (req, res) {
    var cards = [];
    var cardIcons = GameModel.schema.path('cardIcons').options.default;

    var multiparty = require('multiparty');
    var libxmljs = require('libxmljs');
    var fs = require('fs');

    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        var uploadFile = files.file[0];
        var uploadFilePath = uploadFile['path'];
        var file = fs.readFileSync(uploadFilePath);

        try {
            var xmlDoc = libxmljs.parseXmlString(file.toString());
        } catch (e) {
            res.status(500);
            res.end('File is not XML');

            //TODO: Check how to handle errors properly
            return;
        }

        var items = xmlDoc.find('//item');

        items.forEach(function (item) {
            var link = item.get('link').text();
            var title = item.get('summary').text();
            var description = item.get('description').text();
            var key = item.get('key').text();
            var reporter = item.get('reporter').text();
            var cardType = item.get('type').text();
            cardType = cardType ? cardType.toLowerCase() : '';

            var card = new CardModel({
                key: key,
                link: link,
                title: title,
                description: description,
                reporter: reporter,
                typeIcon: cardIcons[cardType] ? cardIcons[cardType] : ''
            });

            cards.push(card);
        });

        res.json(cards);
    });

    form.on('close', function () {
//        res.json(cards);
    });

    form.on('progress', function (bytesReceived) {
        if (1024000 < bytesReceived) {
            res.status(500);
            res.end('File is too big');

            //TODO: Check how to handle errors properly
            return;
        }
    });
};
