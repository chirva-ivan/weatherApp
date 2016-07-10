var myApp = angular.module('weatherApp', ['ngAnimate', 'ui.bootstrap']);

myApp.controller('weather', function($scope, $http) {

	// Массив выбранных городов.
	$scope.cities = [];	
	
	// Подключаем карту.
	var map;
	ymaps.ready(function() { 
    	map = new ymaps.Map("YMapsID", {
    		center: [44.54, 34.28],
    		zoom: 4,
		controls: ["zoomControl"]
    		});
  	});

	// Функция запроса списка возможных городов.
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

	// функция вызыва города.
	$scope.getLocation = function(city) {

		// Находим выбранный ранее город из массива городо в похожим названием.
		// Массив пришел из $scope.getLocationUI.
		$scope.currentCity = $scope.responseResult.find( function() {
			return city;
		});

		// Шаблон запроса погоды по координатам.
		var apiCall = 'http://api.openweathermap.org/data/2.5/weather?lat=' + $scope.currentCity.geometry.location.lat + '&lon=' + $scope.currentCity.geometry.location.lng + '&APPID=c53269f6632df35d2665dbc13b3ab454';
		
		// Запрос погоды.
		$http.get(apiCall).then(function(res) {
			
			// Переводим температуру в цильсии и добавляем в объект	текущего города.
			$scope.currentCity.weather = { temp: Math.round( res.data.main.temp - 273,15) };
								
		}).then(function(){
		
			// Создаем метку на карте.
			var placemark = new ymaps.Placemark([$scope.currentCity.geometry.location.lat, $scope.currentCity.geometry.location.lng], {
           			balloonContent: "Temperature: " + $scope.currentCity.weather.temp + '&degC',
				hintContent: $scope.currentCity.formatted_address,
           			center: [$scope.currentCity.geometry.location.lat, $scope.currentCity.geometry.location.lng]
        		}, {
            			preset: 'twirl#violetIcon'
			});
		
			// Отображаем метку на карте и центрируемся на метке.
			map.geoObjects.add(placemark); 
			map.setCenter([$scope.currentCity.geometry.location.lat, $scope.currentCity.geometry.location.lng]);
			
			// Сохраняем параметры метки в объекте текущего города.
			$scope.currentCity.placemark = placemark;
		
		}).then(function(){

			// Добавляем выбранный город в массив выбранных городов.
			$scope.cities.push($scope.currentCity); 

		});
	};

	// функция удаления.
	$scope.remove = function(city) {
		// Удаляем метку.
		map.geoObjects.remove($scope.cities[$scope.cities.indexOf(city)].placemark);
		// Удаляем город из массива.
		$scope.cities.splice( $scope.cities.indexOf(city), 1 );
	};	

	// Сортировка.
	$scope.predicate = '';
	$scope.reverse = false;

	$scope.order = function(predicate) {
   		$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
		$scope.predicate = predicate;
	};
})