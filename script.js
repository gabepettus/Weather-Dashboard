$(document).ready(function () {
  let test = true;
  // use school key inorder to get forecast data
  const apiKey = "166a433c57516f51dfab1f7edaed8413";
  let url = 'https://api.openweathermap.org/data/2.5/';
  let requestType = ""; 
  let query ="";
  //

  // pull current location
  $('#getWeather').on('click', function () {
    // get location from user input box
    let location = $('#city-search').val();
    if (test) { console.log('location:' + location); }

    getCurWeather(location);
    getForecastWeather(location);
  });

  function convertDate(epoch) {
    // function to convert unix epoch to local time
    // returns arr ["MM/DD/YYYY, HH:MM:SS AM", "MM/DD/YYYY", "HH:MM:SS AM"]
    if (test) { console.log(`convertData - epoch: ${epoch}`); }
    let readable = [];
    let myDate = new Date(epoch * 1000);

    // local time
    // returns string "MM/DD/YYYY, HH:MM:SS AM"
    readable[0] = (myDate.toLocaleString());
    readable[1] = ((myDate.toLocaleString().split(", "))[0]);
    readable[2] = ((myDate.toLocaleString().split(", "))[1]);

    if (test) { console.log(` readable[0]: ${readable[0]}`); }
    return readable;
  }

  function getCurLocation() {
    // This function is based on geoFindMe function found at
    //https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
    //this function return an object with the lat and lon of current location
    if (test) { console.log("getCurLocation"); }

    let location = {};

    function success(position) {
      if (test) { console.log(" success"); }
      if (test) { console.log("  location", position); }

      location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        success: true
      }
      if (test) { console.log(" success location", location); }
      getCurWeather(location);
      getForecastWeather(location);
    }

    function error() {
      location = { success: false }
      console.log('Could not get location');
      return location;
    }

    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  function getCurWeather(loc) {
    // function to get current weather
    // returns object of current weather data
    if (test) { console.log("getCurWeather - loc:", loc); }
    if (test) { console.log("getCurWeather - toloc:",typeof loc); }

    if (typeof loc === "object") {
      city = `lat=${loc.latitude}&lon=${loc.longitude}`;
    } else {
      city = `q=${loc}`;
    }

    // set queryURL based on type of query
    requestType = 'weather';
    query = `?${city}&units=imperial&appid=${apiKey}`;
    queryURL = `${url}${requestType}${query}`;

    if (test) console.log(`cur queryURL: ${queryURL}`);
    // Create an AJAX call to retrieve data Log the data in console
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function (response) {
      console.log(response);


      weatherObj = {
        city: `${response.name}`,
        wind: response.wind.speed,
        humidity: response.main.humidity,
        temp: response.main.temp,
        date: (convertDate(response.dt))[0],
      }

      // calls function to draw results to page
      drawCurWeather(weatherObj);
      getUvIndex(loc);
    });
  };

  function getForecastWeather(loc) {
    // function to get 5 day forecast data
    // returns array of daily weather objects
    if (test) { console.log("getForecastWeather - loc:", loc); }

    if (typeof loc === "object") {
      city = `lat=${loc.latitude}&lon=${loc.longitude}`;
    } else {
      city = `q=${loc}`;
    }

    // array to hold all the days of results
    let weatherArr = [];
    let weatherObj = {};

    // set queryURL based on type of query
    requestType = 'forecast/daily';
    query = `?${city}&cnt=6&units=imperial&appid=${apiKey}`;
    queryURL = `${url}${requestType}${query}`;

    // Create an AJAX call to retrieve data Log the data in console
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function (response) {
      console.log(response);

      for (let i = 1; i < response.list.length; i++) {
        let cur = response.list[i]
        // TODO check for errors/no data
        weatherObj = {
          weather: cur.weather[0].description,
          minTemp: cur.temp.min,
          maxTemp: cur.temp.max,
          humidity: cur.humidity,
          date: (convertDate(cur.dt))[1]
        };

        weatherArr.push(weatherObj);
      }

      drawForecast(weatherArr);
    });
  };

  function drawCurWeather(cur) {
    // function to draw  weather all days
    // need logic to pick variables
    if (test) { console.log('drawCurWeather - cur:', cur); }
    $('#forecast').empty(); 
    $('#cityName').text(cur.city + " (" + cur.date + ")");
    $('#curTemp').text("Temp: " + cur.temp + " F");
    $('#curHum').text("Humidity: " + cur.humidity + "%");
    $('#curWind').text("Windspeed: " + cur.wind + " MPH");
  };

  function drawForecast(cur) {
    if (test) { console.log('drawForecast - cur:', cur); }

    for (let i = 0; i < cur.length; i++) {
      //
      let $colmx1 = $('<div class="col mx-1">');
      let $cardBody = $('<div class="card-body forecast-card">');
      let $cardTitle = $('<h5 class="card-title">');
      $cardTitle.text(cur[i].date);

      let $ul = $('<ul>');

      let $iconLi = $('<li>');
      let $iconI = $('<i>');
      $iconI.attr = $('alt', cur[i].weather);

      let $tempMinLi = $('<li>');
      $tempMinLi.text('Min Temp: ' + cur[i].minTemp + " F");

      let $tempMaxLi = $('<li>');
      $tempMaxLi.text('Max Temp: ' + cur[i].maxTemp + " F");

      let $humLi = $('<li>');
      $humLi.text('Humidity: ' + cur[i].humidity + "%");

      // assemble element
      $iconLi.append($iconI);

      $ul.append($iconLi);
      $ul.append($tempMinLi);
      $ul.append($tempMaxLi);
      $ul.append($humLi);

      $cardTitle.append($ul);
      $cardBody.append($cardTitle);
      $colmx1.append($cardBody);

      //  $('#forecast').append($colmx1);
      $('#forecast').append($colmx1);
    }
  };

  function getUvIndex(loc) {
    if (test) { console.log('getUvIndex'); }
    // function to color uv index

    if (typeof loc === "object") {
      city = `lat=${parseInt(loc.latitude)}&lon=${parseInt(loc.longitude)}`;
    } else {
      city = `q=${loc}`;
    }

    // array to hold all the days of results

    // set queryURL based on type of query
    requestType = 'uvi';
    query = `?${city}&appid=${apiKey}`;
    queryURL = `${url}${requestType}${query}`;

    // Create an AJAX call to retrieve data Log the data in console
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function (response) {
      console.log("uvi",response);
      let bkcolor = "violet";
      
      if (test) response.value = 7.1234567;

      let uv = parseFloat(response.value);
      console.log("uv",uv)
      console.log("type of uv",typeof uv);

      if (uv < 3) { 
        bkcolor = 'green';
      } else if (uv < 6) { 
        bkcolor = 'yellow';
      } else if (uv < 8) { 
        bkcolor = 'orange';
      } else if (uv < 11) { 
        bkcolor = 'red';
      }

      let title = '<span>UV Index: </span>';
      let color = title + `<span style="background-color: ${bkcolor}; padding: 0 7px 0 7px;">${response.value}</span>`;

      $('#curUv').html(color);
    }); 
  };

  function getHistory() {
    // function to pull city history from local memory
    if (test) { console.log('getHistory'); }
    let historyArr = [];

    return historyArr;
  };

  // will get location when page initializes
  const location = getCurLocation();
});