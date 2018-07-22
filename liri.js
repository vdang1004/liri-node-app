var keys = require("./keys.js");
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var client = new Twitter(keys.twitter);
var input = process.argv;
var command = input[2];
var inputs = "";
for (var i=3; i<input.length; i++){
	inputs = inputs + " " + input[i];
}

switch (command) {
	case "my-tweets":
	showTwitter(inputs);
	break;

	case "spotify-this-song":
	showSpotify(inputs);
	break;

	case "movie-this":
	showMovie(inputs);
	break;

	case "do-what-it-says":
	doThis();
	break;
};

function showTwitter(inputs) {
	var userName = {screen_name: inputs, count: 20};
		client.get('statuses/user_timeline', userName, function(error, tweets, response) {
			if (!error) {
				for (i = 0; i < tweets.length; i ++){
					console.log("Tweet: " + "'" + tweets[i].text + "'" + " Created At: " + tweets[i].created_at);
				}
			} else {
				console.log(error);
			}
		});
}

function showSpotify(inputs) {
	var spotify = new Spotify(keys.spotify);
		if (!inputs){
        	inputs = 'The Sign';
    	}
		spotify.search({ type: 'track', query: inputs }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
	        }
	        var songInfo = data.tracks.items;
	        console.log("Artist(s): " + songInfo[0].artists[0].name);
	        console.log("Song Name: " + songInfo[0].name);
	        console.log("Preview Link: " + songInfo[0].preview_url);
	        console.log("Album: " + songInfo[0].album.name);
	});
}


function showMovie(inputs) {

	var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=trilogy";
	request(queryUrl, function(error, response, body) {
		if (!inputs){
        	inputs = 'Mr Nobody';
    	}
		if (!error && response.statusCode === 200) {

		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[0].Value);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		}
	});
};

function doThis() {
	fs.readFile('random.txt', "utf8", function(error, data){
		if (error) {
    		return console.log(error);
  		}
		var dataArr = data.split(",");
		if (dataArr[0] === "spotify-this-song") {
			var songName = dataArr[1].slice(1, -1);
			showSpotify(songName);
		} else if (dataArr[0] === "my-tweets") {
			var twitterName = dataArr[1].slice(1, -1);
			showTwitter(twitterName);
		} else if(dataArr[0] === "movie-this") {
			var movieName = dataArr[1].slice(1, -1);
			showMovie(movieName);
		} 
  	});
};

