$(document).ready(function() {
	var geocoder;
	var map;
	var center;
	var service;
	var markers = [];
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	$("#destination").hide();
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
	}


	function locateAddress() {
		var address = document.getElementById('address').value;
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				center = results[0].geometry.location;
				console.log(center);
				map.setCenter(center);
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
				});
				markers.push(marker);
			} else {
				alert("Look up not successful, error reason: " + status);
			}
		});
	}

	function eventSearch() {
		var request = {
			location: center,
			radius: '1000',
			query: document.getElementById('event').value
		};
		infowindow = new google.maps.InfoWindow();
		service = new google.maps.places.PlacesService(map);
		service.textSearch(request, callback);
	}

	function callback(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
    		for (var i = 0; i < results.length; i++) {
      			var place = results[i];
      			createMarker(results[i]);
    		}
  		}
	}
	function createMarker(place) {
  		var placeLoc = place.geometry.location;
  		
  		var marker = new google.maps.Marker({
    		map: map,
    		position: place.geometry.location
  		});
  		markers.push(marker);
  		google.maps.event.addListener(marker, 'click', function() {
    		infowindow.setContent(place.name);
    		infowindow.open(map, this);
    		$("#destination").attr("value", placeLoc);
  		});
  		$(".drive").click(calcRoute);

	}
	function calcRoute() {
  		var start = document.getElementById('address').value;
  		var end = document.getElementById('destination').value;
  		var request = {
    		origin: start,
    		destination: end,
    		travelMode: google.maps.TravelMode.DRIVING
  		};
  		directionsService.route(request, function(response, status) {
    		if (status == google.maps.DirectionsStatus.OK) {
      			directionsDisplay.setDirections(response);
    		} else {
    			alert("Error!")
    		}
  		});
	}
	google.maps.event.addDomListener(window, 'load', initialize);
	$("#lookup").click(locateAddress);
	$("#find").click(eventSearch);
	$("#deleteMarkers").click(function() {
		$.each(markers, function(index) {
			markers[index].setMap(null);
		});
		markers.length = 0;
	});
	$("#direction").click(calcRoute);
});