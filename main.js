var myApp = angular.module('weatherApp', ['ngAnimate', 'ui.bootstrap']);

myApp.controller('weather', function($scope, $http) {


	$scope.cities = new Array ();	// массив выбранных городов
	
	// создаем карту
	var map;
	ymaps.ready(function () { 
    	map = new ymaps.Map("YMapsID", {
    		center: [44.54, 34.28],
    		zoom: 4,
		controls: ["zoomControl"]
    		});
  	});

	$scope.getLocationUI = function(val) {
		return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
			params: {
				address: val,
				sensor: false
			}
		}).then(function(response){
			$scope.responseResult = response.data.results;
			return response.data.results.map(function(item){
				return item.formatted_address;
			
			});
		});
	};

	// функция вызыва города
	$scope.getLocation = function () {

		// находим выбранный ранее город
		for ( var i = 0; $scope.responseResult.length > i; i++ )
			$scope.responseResult[i].formatted_address == $scope.asyncSelected ? $scope.currentCity = $scope.responseResult[i] : false;

		// шаблон вызова
		var apiCall = 'http://api.openweathermap.org/data/2.5/weather?lat=' + $scope.currentCity.geometry.location.lat + '&lon=' + $scope.currentCity.geometry.location.lng + '&APPID=c53269f6632df35d2665dbc13b3ab454';
		
		// сам вызов 
		$http.get( apiCall ).then( function(res) {
			
			// переводим температуру в цильсии и добавляем в объект	
			$scope.currentCity.weather = { temp: Math.round( res.data.main.temp - 273,15) };
								
		}).then( function(){
		
			// создаем метку
			var placemark = new ymaps.Placemark([$scope.currentCity.geometry.location.lat, $scope.currentCity.geometry.location.lng], {
           			balloonContent: "Temperature: " + $scope.currentCity.weather.index + $scope.currentCity.weather.temp + '&degC',
				hintContent: $scope.currentCity.formatted_address,
           			center: [$scope.currentCity.geometry.location.lat, $scope.currentCity.geometry.location.lng]
        		}, {
            			preset: 'twirl#violetIcon'
			});
		
			map.geoObjects.add(placemark); // показываем метку на карте
			map.setCenter([$scope.currentCity.geometry.location.lat, $scope.currentCity.geometry.location.lng]); // центрируемся на метке
			
			$scope.currentCity.placemark = placemark;
		
		}).then( function() {

			$scope.cities.push( $scope.currentCity ); // добавляем выбранный город в массив

		});
	};

	// функция удаления
	$scope.remove = function (city) {		
		map.geoObjects.remove($scope.cities[$scope.cities.indexOf(city)].placemark); // удаляем метку
		$scope.cities.splice( $scope.cities.indexOf(city), 1 ); // удаляем город из массива
	};
	

	// сортировка
	$scope.predicate = '';
	$scope.reverse = false;

	$scope.order = function(predicate) {
   		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
	};

})