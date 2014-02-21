$(document).ready(function() {
	var geocoder;
	var map;
	function initialize() {
		geocoder = new google.maps.Geocoder();
		var latlng = new google.maps.LatLng(37.775, -122.419);
		var mapOptions = {
			zoom: 8,
			center: latlng
		}
		map = new google.maps.Map(document.getElementById("map"), mapOptions);
	}


	function locateAddress() {
		var address = document.getElementById('address').value;
		geocoder.geocode( { 'address': address}, function(results, status) {
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
	google.maps.event.addDomListener(window, 'load', initialize);
	$("#lookup").click(locateAddress);
});