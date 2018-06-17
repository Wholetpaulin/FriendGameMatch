// input: Names of people to match games -->

// output: List of games all those people have <--

// steam api key: A8B02BBDEA37016E013FE1F1E72D08B5

// 1. Input several friends IDs

// 2. GetOwnedGames for all friends that were input

// 3. Compile a finalarr of all similar games

// 4. Translate and print out the game names for all the game in finalarr

// http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=A8B02BBDEA37016E013FE1F1E72D08B5&steamid=76561198084532463&format=json

var rp = require('request-promise');

let similarList = [];

function buildSimilarList(...theArgs){  
    return new Promise((resolve, reject) => {
        for(let i = 0; i < theArgs.length; i++){ // for each arg passed in run GetOwnedGames
            getOwnedGames(theArgs[i], 1) // Add each array of owned games into similarList
                .then((result) =>{
                    similarList.push(result);
                })
                .then(() => {
                    if(similarList.length >= theArgs.length) {
                        resolve(similarList);
                    }
                });
        }
        reject; 
    });
}

function getOwnedGames(steamId, includeF2P) { // This makes a call to the steam api for a list of a user's games
    return rp(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=A8B02BBDEA37016E013FE1F1E72D08B5&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=${includeF2P}`)
    .then((response) => {   // ^change 1 to 0 to leave out free to play games
        return response;  // ...unfortunetly you ca only call this for one steam user at a time..
    })
    .catch((err) => {
        throw err;
    });
}

function compileGamesList(longArr) { // Go through the long array of arrays and pick out elements that exist in all arrays
    // for each element in the outer most array check if any objects match what was in the last array
    // if no objects are in the last array make the current element the array
    let lastArr = []; // This array is used to keep track of similar games
    longArr.forEach((i) => { // For each element in the large array
        if(lastArr.length != 0) {
            // check if any similar elements in the last array and long array
            // The more beers I drink the more comments and the less code I write
            // {response.games} is what I want!
        } else{
            lastArr = longArr[i]; // make the last array the same as the first in the long array
        }
      });
}

function digOut(messyArr){ // Don't dig pit
    let resultArr = [];
    for(let j = 0; j < messyArr.length; j++) { // why didn't a foreach work here??
        let cleanArr = [];
        subMessyArr = JSON.parse(messyArr[j]).response.games;
        for(let i = 0; i < subMessyArr.length; i++) { // why didn't a foreach work here??
            cleanArr.push(subMessyArr[i].name);
            if(cleanArr.length >= subMessyArr.length) {
                resultArr.push(cleanArr);
            }
        }
        if(resultArr.length >= messyArr.length) {
            return resultArr;
        }
    };
}

function compare(arrs) { // This function was totally not borrowed from SO
    var resArr = [];
    for (let i = arrs[0].length - 1; i > 0; i--) {

        for (var j = arrs.length - 1; j > 0; j--) {
            if (arrs[j].indexOf(arrs[0][i]) == -1) {
                break;
            }
        }
        if (j === 0) {
            resArr.push(arrs[0][i]);
        }
    }
    return resArr;
}

/**
 * ----------------------Main App------------------------------
 */

// You can get steamid from the number in the url of people's profile page
buildSimilarList('76561198084532463', '76561198084269582', '76561198075802266') // me, Don Con, Campbell
    .then((messyArr) => {
        return digOut(messyArr); // clean up the messy response from steam... DIG OUT what we want!
    })
    .then((resultArr) => {
        return compare(resultArr); // find the common elements in each array
    })
    .then(console.log); // log out what was resolved by the promise
 
