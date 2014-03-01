$(document).ready(function() {
	var geocoder;
	var map;
	var center;
	var service;
	var markers = [];
	var destination = "";
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	//On page load, display google map and default streetview.
	function initialize() {
		directionsDisplay = new google.maps.DirectionsRenderer();
		geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(37.775, -122.419);
		var mapOptions = {
			zoom: 15,
			center: latlng
		}
		map = new google.maps.Map(document.getElementById("map"), mapOptions);
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById('directions-panel'));
		createStreetView(latlng);
	}

	//Function used to take in search address and display it on the map.
	function locateAddress() {
		var address = document.getElementById('address').value;
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				center = results[0].geometry.location;
				console.log(center);
				map.setCenter(center);
				var marker = new google.maps.Marker({
					map: map,
					position: center
				});
				markers.push(marker);
			} else {
				alert("Look up not successful, error reason: " + status);
			}
		});
	}
	//Function used to run a textsearch using google map API.
	function eventSearch() {
		var request = {
			location: center,
			radius: '1000',
			query: document.getElementById('event').value
		};
		infowindow = new google.maps.InfoWindow({
			maxWidth: 150
		});
		service = new google.maps.places.PlacesService(map);
		service.textSearch(request, callback);
	}
	//Callback function for eventSearch function.
	function callback(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
    		for (var i = 0; i < results.length; i++) {
      			var place = results[i];
      			createMarker(place);
    		}
  		} else {
  			alert("Search Failed, reason: " + status);
  		}
	}
	//Function used to create markers for each event found.
	function createMarker(place) {
  		var placeLoc = place.geometry.location;
  		
  		var marker = new google.maps.Marker({
    		map: map,
    		position: place.geometry.location
  		});
  		markers.push(marker);
  		google.maps.event.addListener(marker, 'click', function() {
  			var content = "<span id='title'>" + place.name + "</span>" + "<br>" + 
  				          "<p id='addr'>" + place.formatted_address + "</p>" + 
  				          "<span id='rating_text'>Rating: </span>" + "<span id='rating_num'>" + place.rating +"</span>"
    		infowindow.setContent(content);
    		infowindow.open(map, marker);
    		destination = placeLoc;
    		createStreetView(placeLoc);
  		});
  	}
  	//Function for creating and displaying streetView.
  	function createStreetView(placeLoc) {
		var panoramaOptions = {
    		position: placeLoc,
    		pov: {
      			heading: 34,
      			pitch: 10
    		}
  		};
  		var panorama = new google.maps.StreetViewPanorama(document.getElementById('streetView'), panoramaOptions);
  		map.setStreetView(panorama);
	}
	//Function for requesting driving direction from google map API.
	function calcRoute() {
  		var start = document.getElementById('address').value;
  		var end = destination;
  		var request = {
    		origin: start,
    		destination: end,
    		travelMode: google.maps.TravelMode.DRIVING
  		};
  		directionsService.route(request, function(response, status) {
    		if (status == google.maps.DirectionsStatus.OK) {
    			directionsDisplay.setPanel(document.getElementById('directions-panel'));
    			directionsDisplay.setMap(map);
      			directionsDisplay.setDirections(response);
    		} else {
    			alert("Error! Reason: " + status);
    		}
  		});
	}
	//Run initialize function when window is loaded.
	google.maps.event.addDomListener(window, 'load', initialize);
	//On button click or enter keypress, invoke locateAddress().
	$("#locate").click(locateAddress);
	$("#address").keydown(function(event) {
		if (event.which === 13) {
			locateAddress();
		}
	});
	//On button click or enter keypress, invoke eventSearch().
	$("#find").click(eventSearch);
	$("#event").keydown(function(event) {
		if (event.which === 13) {
			eventSearch();
		}
	});
	//Used to delete all markers currently on the map.
	$("#deleteMarkers").click(function() {
		$.each(markers, function(index) {
			markers[index].setMap(null);
		});
		markers.length = 0;
		directionsDisplay.setMap();
		directionsDisplay.setPanel();
		$("#address").val("");
		$("#event").val("");
	});
	//On button click creates a dialog with driving direction embedded.
	$("#direction").click(function() {
		if (destination === "") {
			alert("Pick a destination first!")
		} else {    
        	$("#directions-panel").dialog({
        		dialogClass: "no-close",
        		buttons: { 
        			"Close": function() { $( this ).dialog( "close" ); } 
        			},
            	width: "400",
            	height: "auto",
           	 	position: {
            		my: "right bottom",
            		at: "right top",
            		of: window
            	},
            	show: {
                	effect: "slide",
                	direction: "right",
                	duration: 1000
            	},
            	hide: {
                	effect: "slide",
                	direction: "right",
                	duration: 1000
            	}
        	});
        	calcRoute();
        }
	});
});