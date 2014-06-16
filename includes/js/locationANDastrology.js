var datePicker;
var userName;
var userEmail;
var currAstrology;
var currDay;
var currMonth;
var currYear;
var comment;
var latitude;
var longitude;
var userCountry;
var zodiacSigns=[];
$(document).ready(function() {
		getLocation(); //html5 location
		setTimeout(function(){
			if(!userCountry)
				getIpLocation();
		}, 5000);
	init();
});
$(document).on("pageshow","#page_welcome",function(){ 
	setTimeout(function(){
		$('#details_form #date').css("border","none");
		$.mobile.changePage( "#page_home", { transition: "flip", changeHash: false , revers:false});
	}, 3000);
});
function getIpLocation() {
	$.get("http://ipinfo.io/" + myip, function(response) {
		//console.log(response); country region city loc
		longitude= response.loc.substring(0,response.loc.indexOf(","));
		latitude=response.loc.substring(response.loc.indexOf(",")+1,response.loc.length);
		console.log("IP location - " + longitude+" "+latitude);
		getCountryName(longitude,latitude);
	}, "jsonp");
}
function getLocation() {
	navigator.geolocation.getCurrentPosition(showPosition, errorHandler);
}
function showPosition(position) {
	console.log("HTML5 location " + position.coords.latitude + " " + position.coords.longitude);
	longitude = position.coords.latitude;
	latitude = position.coords.longitude;
	getCountryName(longitude,latitude);
}
function getCountryName(longitude,latitude){
	$.ajax({
		url : 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+longitude+','+latitude+'&sensor=true',
		success : function(data) {
			//console.log(data.results[0].formatted_address);
			/*can also iterate the components for only the city and state*/
			for ( i = 0; i < data.results[4].address_components.length; i++) {
				for ( j = 0; j < data.results[4].address_components[i].types.length; j++) {
					if (data.results[4].address_components[i].types[j] == 'country') {
						var country_code = data.results[4].address_components[i].long_name;
						userCountry = country_code;
						console.log('country_code',country_code);
	}}}}});
}
function errorHandler(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			//alert("User denied the request for Geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			//alert("Location information is unavailable.");
			break;
		case error.TIMEOUT:
			//alert("The request to get user location timed out.");
			break;
		case error.UNKNOWN_ERROR:
			//alert("An unknown error occurred.");
			break;
	}
	getIpLocation(); //ip location
}

/* *********************** */
function init(){
	$( "#details_form").submit(function( event ) {
	  event.preventDefault();
	  validate_form();
	}),
	$('#page_astrology a').bind('click',function(){
		var button = this;
		var settings = {
		animation: 700,	// Animation speed
		buttons: {
			confirm: {
				action: function() { $me.dissapear(); }, // Callback function
				className: null, // Custom class name(s)
				id: 'confirm', // Element ID
				text: 'Ok', // Button text
			},
			cancel: {
				action: function() { $me.dissapear(); }, // Callback function
				className: null, // Custom class name(s)
				id: 'cancel', // Element ID
				text: 'cancel', // Button text
			}
		},
		input: false, // input dialog
		override: true, // Override browser navigation while Apprise is visible
	};
	var options = {
	buttons: {
		cancel: {
			text: 'Cancel',
			className: 'greyL',
			action: function(e) {
			   	comment="No Comment";
				$.mobile.changePage( "#page_statistics", { transition: "flip", changeHash: true , revers:true});
				addToDb(button);
				Apprise('close');
			}
		},
		confirm: {
			text: 'Comment',
			className: 'greyR',
			action: function(e) {
				comment=e.input;
				if (comment == null)
	    	 		comment="No Comment";
			    $.mobile.changePage( "#page_statistics", { transition: "flip", changeHash: true , revers:true});
				addToDb(button);
				Apprise('close');
			}
		},
	},
	input: true,
};
Apprise('Insert your comment', options);
	     
	}),
	$('#details_form #date').bind('click',function(){
		initDatePicker();
		$('#details_form #date').unbind('click');
	}),
	$('#details_form #date').bind('focus',function(){
		this.type='date';
	});
	$.getJSON('includes/js/database.json', function(data) {
 	 	for(i in data.zodiacSigns){
			zodiacSigns.push(data.zodiacSigns[i]);
		}
	});
}
function saveComment(){
	
}
function initDatePicker() {
	$('#details_form #date').css("border","none");
	var now = new Date();
	currDay = ("0" + now.getDate()).slice(-2);
	currMonth = ("0" + (now.getMonth() + 1)).slice(-2);
	currYear = now.getFullYear();
	today = (currYear) + "-" + (currMonth) + "-" + (currDay);
	$('#date').val(today);
	if (currDay < 10)currDay = parseInt(currDay,10 );// day
	if (currMonth < 10)currMonth = parseInt(currMonth,10 );// month
	$("#submit").attr("href", "#page_astrology");
}

function validate_form() {
	if(!$('#details_form #date').val()) {
          $('#details_form #date').css("border","2px solid red");
    }
    else{
		datePicker = $('#date').val().split("-");
		datePicker[0]; // year
		if (datePicker[1] < 10)datePicker[1] = parseInt(datePicker[1], 10);// day
		if (datePicker[2] < 10)datePicker[2] = parseInt(datePicker[2], 10);// month
		userName = $('#full_name').val();
		userEmail = $('#email').val();
		xmlLoader(); 
		$.mobile.changePage( "#page_astrology", { transition: "flip", changeHash: true , revers:true});
	}
}

function xmlLoader() {
	astrologyUrl = "http://www.findyourfate.com/rss/horoscope-astrology-feed.asp?mode=view&todate=" + currMonth + "/" + currDay + "/" + currYear;
	$.ajax({
		url : astrologyUrl,
		dataType : "xml",
		type : 'GET',
		success : function(res) {
			var myXML = res.responseText;
			// This is the part xml2Json comes in.
			var JSONConvertedXML = $.xml2json(myXML);
			//console.log(JSONConvertedXML);
			var zodiac = getZodiac(datePicker[2], datePicker[1]);
			console.log(zodiac);
			// return the zodiac sign
			for (var i = 0; i < JSONConvertedXML.channel.item.length; i++) {
				//console.log(JSONConvertedXML.channel.item[i].title);
				if (JSONConvertedXML.channel.item[i].title.indexOf(zodiac.name) != -1) {
					console.log('title',JSONConvertedXML.channel.item[i].title);
					console.log('astrology',JSONConvertedXML.channel.item[i].description);
					currAstrology=JSONConvertedXML.channel.item[i].description;
					$('#astrology').html("");
					$('#astrology').append("<p class='zodiac_name'>"+zodiac.name+"</p>");
					$('#astrology').append("<p class='zodiac_astrology'>"+currAstrology+"</p>");
					$('#page_astrology').css('background-image', 'url(' + zodiac.background+ ')');
					$('#page_astrology .zodiac_name').css('background-image', 'url(' + zodiac.icon+ ')');
					$.mobile.changePage( "#page_astrology", { transition: "flip", changeHash: true , revers:true});
					//translateText(currAstrology);
					break;
	}}}});
}
var translateKey = "AIzaSyDfOz-UPBbBZFd1S3Qmfo_FPyP-P1lx_Z8";
function translateText(text) { 
	var browsrLanguage;
	$.ajax({
		url : "http://ajaxhttpheaders.appspot.com",
		dataType : 'jsonp',
		success : function(headers) {
			browsrLanguage = headers['Accept-Language'].substring(0,2);
			console.log('browser language',browsrLanguage);
		}
	});
	$.ajax({
		url : "http://avishay.eu5.org/?translate=true&text=hello&from=en&to=iw",
		type : 'GET',
		async: true,
		dataType : 'text',
		//contentType: "application/x-www-form-urlencoded;charset=ISO-8859-15",
		contentType: "charset=utf-8", 
		success : function(res) {
			console.log('res', res);
		},
		error : function(xhr, ajaxOptions, thrownError) {
			console.log("php translate error");
		}
	}); 
}
function getZodiac(day, month) {
	if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) {return zodiacSigns.capricorn;
	} else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) {return zodiacSigns[0].aquarius;
	} else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {return zodiacSigns[0].pisces;
	} else if ((month == 3 && day >= 21) || (month == 4 && day <= 20)) {return zodiacSigns[0].aries;
	} else if ((month == 4 && day >= 21) || (month == 5 && day <= 20)) {return zodiacSigns[0].taurus;
	} else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {return zodiacSigns[0].gemini;
	} else if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) {return zodiacSigns[0].cancer;
	} else if ((month == 7 && day >= 23) || (month == 8 && day <= 23)) {return zodiacSigns[0].leo;
	} else if ((month == 8 && day >= 24) || (month == 9 && day <= 23)) {return zodiacSigns[0].virgo;
	} else if ((month == 9 && day >= 24) || (month == 10 && day <= 23)) {return zodiacSigns[0].libra;
	} else if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) {return zodiacSigns[0].scorpio;
	} else if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) {return zodiacSigns[0].sagittarius;}
}
