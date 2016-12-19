// myscript - Sharon Lee

var lat, long;
var map;
var forecastList = new Array();
var newForecast;
var rowID;	// use to hold user's selecction

function Forecast (code, date, day, high, low, text) {
	this.code = code;
	this.date = date;
	this.day = day;
	this.high = high;
	this.low = low;
	this.text = text;
}

$(document).on("pagecreate", "#home", function(){
	
	$.getJSON("torontoWeather.json", function (data){
	console.log(data);
	
	head = data.query.results.channel;
	
	$("header#homeheader").html("<br><img src='" +
					head.image.url + "' style='display: block; margin: 0 auto;'>" + 
					"<h4 style='text-align:center;'>" +
					"Image:url " + head.image.url + 
					"<br>" +
					"Last build date: " + head.lastBuildDate + 
					"</h4>");
	loc = data.query.results.channel.location;	
	$("#location").html("<h4 style='text-align:center;'>" +
					"City: " + loc.city + 
					"<br>" + 
					"Country: " +loc.country + 
					"<br>" + 
					"Region: " +loc.region +
					"</h4>");				
					
	panel = data.query.results.channel;	
	$("#wind").html("<h4>" +
					"Chill: " + panel.wind.chill + 
					"</h4><h4>" + 
					"Direction: " + panel.wind.direction + 
					"</h4><h4>" + 
					"Speed: " + panel.wind.speed + 
					"</h4>");				
	$("#atmosphere").html("<h4>" +
					"Humidity: " + panel.atmosphere.humidity + 
					"</h4><h4>" + 
					"Pressure: " + panel.atmosphere.pressure + 
					"</h4><h4>" + 
					"Rising: " + panel.atmosphere.rising + 
					"</h4><h4>" + 
					"Visibility: " + panel.atmosphere.visibility + 
					"</h4>");					
	$("#astronomy").html("<h4>" +
					"Sunrise: " + panel.astronomy.sunrise + 
					"</h4><h4>" + 
					"Sunset: " + panel.astronomy.sunset + 
					"</h4>");				
					
	// Map button click
	$("#map").click(function() {
		lat = data.query.results.channel.item.lat;
		long = data.query.results.channel.item.long;
		//$("#lat").html(lat);
		//$("#long").html(long);
		
		tomap = new google.maps.LatLng(lat, long);
		var mapTo = {
			center: tomap,
			zoom: 16, 
			mapTypeId: google.maps.MapTypeId.HYBRID
		}
		
		// draw map.... need output location and options
		map = new google.maps.Map(document.getElementById("map_canvas"), mapTo);
		
		toLoc =  new google.maps.Marker({
				map: map,
				icon: "_images/pushpin.gif",
				animation: google.maps.Animation.DROP,
				position: tomap	// center point
			});
			
		//	 info window
		toInfo = new google.maps.InfoWindow({
			content: "Title: <br>" + 
			data.query.results.channel.item.title
			
			})
		
		//	add a listener to listen for a click on marker
		google.maps.event.addListener(toLoc, "click", function(){
			toInfo.open(map, toLoc);
			});
		});	

	
	});	
});

$(document).on("pagecreate", "#popup", function(){

	$.getJSON("info.json", function (data){
	console.log(data);
	
	information = data.student;
	
	$("#info").html("<h5>" +
					"Student Name: " + 
					information.sName + 
					"<br><br>" + 
					"Student Number: " + 
					information.sNumber + 
					"<br><br>" + 
					"Program: " + 
					information.sProgram + 
					"<br><br>" + 
					"Quote: " + 
					information.quote + 
					"<br>" +
					"</h5>");
	$("#pic").html("<h5>Personal image<br><img src='_images/" +
					information.img +
					"' style='width:40%; height:50%; display: block; margin: 0 auto;'></h5>");
		
	});
	
});

$(document).on("pagebeforeshow", "#forecast", function(){
	
	$.getJSON("torontoWeather.json", function (data){
		console.log(data);

		
	// Forecast button click
	forecast = data.query.results.channel.item.forecast;
	
	var n=0;	
	$("ul#fcmenu").html("");
	
		for (x = 0; x < forecast.length; x++)
		{
			$("ul#fcmenu").append(
			"<li li-id='" + n + "'>" + 
				"<a href='#indforecast'>" +
				forecast[x].date +
				"</a>" +			
			"</li>");

			newForecast = new Forecast(forecast[x].code,
						forecast[x].date,
						forecast[x].day,
						forecast[x].high,
						forecast[x].low,
						forecast[x].text
						);
			forecastList.push(newForecast);
			n++;

		}
		console.log(forecastList);
		$("ul#fcmenu").listview("refresh");
	});
	
});

$(document).on("click", "ul#fcmenu >li", function(){
	rowID = $(this).closest("li").attr("li-id");
	console.log("li selected: " + rowID);
});

$(document).on("click", "#forecast", function(){
	
	$.getJSON("torontoWeather.json", function (data){
		
		fc = data.query.results.channel.item.forecast;
		
		$("#forecastinfo").html(
		
			"<h3>Date: " +
			fc[rowID].date +
			"</h3>" +
			
			"<h4>Code: " +
			fc[rowID].code +
			"<br><br>" +

			"Day: " +
			fc[rowID].day +
			"<br><br>" +
			
			"High: " +
			fc[rowID].high +
			"<br><br>" +
			
			"Low: " +
			fc[rowID].low +
			"<br><br>" +
			
			"Text: " +
			fc[rowID].text +
			"</h4>"
		);
	});
});


	/* 
		Local Storage contains:
			form: email --> email	(key)
			form: qc --> qc	(key)
			form: text --> text	(key)
	*/	
 
$(document).ready(function() {
	
	$("#submit").click(function() {
		// if there is an email
		email = $("#email").val();
		
		// if qc is set but no email
		qc = $("input[name='qc']:checked").attr("value");
		text = $("#text").val();
		
		localStorage.setItem("email", email);
		localStorage.setItem("qc", qc);
		localStorage.setItem("text", text);
		
		$("#sinfo").html(
			"<h4><em>The Following information have been saved</em><br><br>" +
			"Email address: " + localStorage.getItem("email") + "<br>" + 
			"Type of question / comment: " + localStorage.getItem("qc") + "<br>" + 
			"Question / Comment: " + localStorage.getItem("text") + "</h4>"
		)
	});


	$("#retrieve").click(function() {
		// pulling Last Information
		$("#rinfo").html(
			"<h4><em>The Last Information </em><br><br>" +
			"Email address: " + localStorage.getItem("email") + "<br>" + 
			"Type of question / comment: " + localStorage.getItem("qc") + "<br>" + 
			"Question / Comment: " + localStorage.getItem("text") + "</h4>"
		)
	});  // end of retrieve

});	