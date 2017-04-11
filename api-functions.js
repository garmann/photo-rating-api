// extra functions

var fs = require('fs');

module.exports = {
    nextFreeId: function(){
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

    }
};



