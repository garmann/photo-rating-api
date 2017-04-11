// extra functions

var fs = require('fs');

module.exports = {
    nextFreeId: function(){
        var findFreeId = function(ids){
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

        var getUsedIds = function(dir){
            var ret = [];

            for (i in dir){
                if(dir[i].match(/details/)){
                    ret.push(parseInt(dir[i].substr(16).slice(0, -5)));

                }
            }

            return ret;
        }

        var dirContent = fs.readdirSync('json/');
        var usedIds = getUsedIds(dirContent);
        var nextFreeIdNumber = findFreeId(usedIds);

        return nextFreeIdNumber;

    },

    checkShootingExists: function(id){
        /*
            return true or false if shooting (id)
                is existing
                AND
                id is a number

            params:
            shootingid (int)
        */

        if (Number.isInteger(id) &&
                fs.existsSync('json/listing-details-' + id + '.json')){
            return true;
        } else {
            return false;
        }

    }


};



