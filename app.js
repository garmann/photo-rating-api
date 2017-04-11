var express = require('express'), cors = require('cors');
var multer = require('multer');
var zip = require('express-zip');
var upload = multer({ storage : 'storage' }).array('userPhoto',50);
var app = express();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
var fs = require('fs');

app.use(bodyParser.json());
app.use(cors());


app.get('/listing-overview', function(request, response){

    var dataFromFile = fs.readFileSync('json/listings.json');
    var jsonFromFile = JSON.parse(dataFromFile);
    response.send(jsonFromFile);

});


app.get('/listing/:listingid', function(request, response){

    var listingid = parseInt(request.params.listingid);
    try {
        var dataFromFile = fs.readFileSync('json/listing-details-' + listingid + '.json');
        var jsonFromFile = JSON.parse(dataFromFile);
    } catch (err) {
        console.log('ERROR: ', err);
        response.status(404).json('could not read file');
    }

    response.send(jsonFromFile);

});


// create a new listing
app.post('/listing', parseUrlencoded, function(request, response){

    if(request.body.shooting && request.body.shooting.description.length > 5){
        var incommingData = request.body;
        var newShootingId = nextFreeId();
        var currentListings = JSON.parse(fs.readFileSync('json/listings.json'));

        currentListings.listings.push(
            {
                id: newShootingId,
                title: incommingData.shooting.title
            }
        );

        fs.writeFileSync('json/listings.json', JSON.stringify(currentListings));

        fs.writeFileSync(
            'json/listing-details-' +
            newShootingId +
            '.json', JSON.stringify(incommingData));

        response.status(201).send('json created, new id: ' + newShootingId);

    } else {
        response.status(404).send('no valid data');
    }

});


// update existing listing
app.put('/listing/:listingid', function(request, response){

    if(request.body.shooting && request.body.shooting.description.length > 5){
        var incommingData = request.body;
        var listingid = parseInt(request.params.listingid);

        // update listings file
        var currentListings = JSON.parse(fs.readFileSync('json/listings.json'));
        var listingTitle = incommingData.shooting.title;

        for (i in currentListings.listings){
            if(currentListings.listings[i].id === listingid){
                //matches current postion in listings array for shootingid
                currentListings.listings[i].title = listingTitle;
                fs.writeFileSync('json/listings.json', JSON.stringify(currentListings));

            }
        }

        // update specific listing file
        fs.writeFileSync(
            'json/listing-details-' +
            listingid +
            '.json', JSON.stringify(incommingData));

        response.status(201).send('json updated');

    } else {

        response.status(418).send('no valid data');
    }

});


app.delete('/listing/:listingid', function(request, response){

    var listingid = parseInt(request.params.listingid);

    // update listings-overview
    var currentListings = JSON.parse(fs.readFileSync('json/listings.json'));

    for (i in currentListings.listings){

        if(currentListings.listings[i].id === listingid){
            //matches current postion in listings array for shootingid

            currentListings.listings.splice(i, 1);

            //delete currentListings.listings[i] in listings.json
            fs.writeFileSync('json/listings.json', JSON.stringify(currentListings));

        }
    }


    // delete json file from disk
    fs.unlink('json/listing-details-' + listingid + '.json');

    response.status(201).send(listingid + 'deleted')

});


/*
 part for downloading whole listings as zip file
*/
app.get('/download-listing/:id', function(request, response){
    var id = parseInt(request.params.id);
    var pathToImages = '../photo-rating/app/res/images/' + id + '/';
    var dirContent = fs.readdirSync(pathToImages);
    var downloadFileName = 'shooting-' + id + '.zip';

    var filesForZipper = [];
    for (var i = 0;i < dirContent.length;i++){
        if (!dirContent[i].match(/^\./)){
            filesForZipper.push({
                path: pathToImages + dirContent[i],
                name: dirContent[i]
            });
        }
    }

    response.zip(filesForZipper, downloadFileName);

});

/*
    part for download single images
*/
app.get('/download-image/:id/:filename', function(request, response){
    var id = parseInt(request.params.id);
    var filename = request.params.filename;
    var pathToImages = '../photo-rating/app/res/images/' + id + '/';
    var downloadFileName = pathToImages + filename;

    response.download(downloadFileName, filename);
});


var server = app.listen(3001, function () {
  console.log("Running Express");
})

module.exports = server;

// extra functions

var nextFreeId = function(){
    var dirContent = fs.readdirSync('json/');
    var usedIds = getUsedIds(dirContent);
    var nextFreeId = findFreeId(usedIds);


    function findFreeId(ids){
        // counter is used for iteration and to check if counter int is in ids
        var counter = 0;
        while(counter < 100){
            counter ++;

            if(!ids.includes(counter)){
                return counter
            }
        }

        throw "max ids";

    }


    function getUsedIds(dir){
        var ret = [];

        for (i in dir){
            if(dir[i].match(/details/)){
                ret.push(parseInt(dir[i].substr(16).slice(0, -5)));

            }
        }

        return ret;
    }

    return nextFreeId;

};
