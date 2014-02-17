$(document).ready(function() {
	var geocoder;
	var map;
	function initialize() {
		geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(37.774929, -122.419416);
		var mapOptions = {
			zoom: 8,
			center: latlng
		}
		map = new google.maps.Map(document.getElementById("map"), mapOptions);
	}

	function locateAddress() {
		var address = document.getElementById('address').value;
		geocoder.geocode( {'address': address}, function(result. status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
				});
			} else {
				alert("Look up not successful, error reason: " + status);
			}
		});
	}
});