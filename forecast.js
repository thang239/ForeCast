var https = require("https");
var http = require("http");

var API_KEY = ("2beb8ab82f10608816d462e1aa89bbdd");

var zipcode = process.argv.slice(2);


function getForeCast(coordinate){
	var request = https.get("https://api.forecast.io/forecast/"+API_KEY+"/"+coordinate,function(response){
			var body = "";
			response.on('data',function(chunk){
				body+=chunk;
			});
		response.on('end', function(){
		if(response.statusCode === 200) {
        	try {

        		var res = JSON.parse(body);
        		console.log(res.currently.summary+", temperature is "+res.currently.temperature+" Farenheit");
        	} catch(error) {
	        	//Parse Error
	        	printError(error);
        	}
	    } else {
	        //Status Code Error
	        printError({message: "There was an error getting the profile for " + coordinate + ". (" + http.STATUS_CODES[response.statusCode] + ")"});
	    }
	});

	});
}

function getCoordinate(zipcode,func){
	var request = http.get("http://maps.googleapis.com/maps/api/geocode/json?address="+zipcode,function(response){
		var res = "";
		response.on('data',function(chunk){
			res+=chunk;
		});
		response.on('end', function(){
        if(response.statusCode === 200) {
        	try {
	          //Parse the data
	          var data = JSON.parse(res);
	          func(data.results[0].geometry.location.lat+","+data.results[0].geometry.location.lng);
	          //Print the data
        	} catch(error) {
          //Parse Error
          printError(error);
        }
      } else {
        //Status Code Error
        printError({message: "There was an error getting the profile for " + zipcode + ". (" + http.STATUS_CODES[response.statusCode] + ")"});
      }
    });

	});
}

getCoordinate(zipcode,function(coordinate){
	getForeCast(coordinate);
})
