$(document).ready(function() {
  let test = true;
  // use school key inorder to get forecast data
  const apiKey = "166a433c57516f51dfab1f7edaed8413";

  // pull current location
  $('#getWeather').on('click',function() {
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
    let myDate = new Date( epoch * 1000);

    // local time
    // returns string "MM/DD/YYYY, HH:MM:SS AM"
    readable[0] = ( myDate.toLocaleString() );
    readable[1] = ( (myDate.toLocaleString().split(", "))[0] );
    readable[2] = ( (myDate.toLocaleString().split(", "))[1] );

    if (test) { console.log(` readable[0]: ${readable[0]}`); }
    return readable;
  }

  function getCurLocation () {
    //insert API
    //https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
    if (test) { console.log('getCurLocation'); }

    let location = '';
    return location;
  };

  function getCurWeather(loc) {
    // function to get current weather
    // returns object of current weather data
    if (test) { console.log(`getCurWeather - loc: ${loc}`); }

    const city = loc;
    // object in which to daily weather results
    let weatherObj = {};

    // set queryURL based on type of query
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    // Create an AJAX call to retrieve data Log the data in console
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      console.log(response);

      weatherObj = {
        city: response.name,
        wind: response.wind.speed,
        humidity: response.main.humidity,
        temp: response.main.temp,
        date: (convertDate(response.dt))[0],
        uvHTML: getUvIndex()
      }

      // calls function to draw results to page
      drawCurWeather(weatherObj);
    });
  };

  function getForecastWeather(loc) {
    // function to get 5 day forecast data
    // returns array of daily weather objects
    if (test) { console.log(`getForecastWeather - loc: ${loc}`); }
    const city = loc;

    // array to hold all the days of results
    let weatherArr = [];
    let weatherObj = {};

    // set queryURL based on type of query
    queryURL = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=5&units=imperial&appid=${apiKey}`;

    // Create an AJAX call to retrieve data Log the data in console
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      console.log(response);

      for (let i=0; i<response.list.length; i++) {
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
      $('#cityName').text(cur.city + " (" + cur.date +")");
      $('#curTemp').text("Temp: " + cur.temp + " F");
      $('#curHum').text("Humidity: " + cur.humidity + "%");
      $('#curWind').text("Windspeed: " + cur.wind + " MPH");
      $('#curUv').html(cur.uvHTML);
  };

  function drawForecast(cur) {
    if (test) { console.log('drawForecast - cur:', cur); }

    for (let i=0; i<cur.length; i++) {
      //
       let $colmx1 = $('<div class="col mx-1">');
       let $cardBody = $('<div class="card-body forecast-card">');
       let $cardTitle = $('<h5 class="card-title">');
       $cardTitle.text(cur[i].date);

       let $ul = $('<ul>');

       let $iconLi = $('<li>');
       let $iconI = $('<i>');
       $iconI.attr = $('alt',cur[i].weather);

       let $tempMinLi = $('<li>');
       $tempMinLi.text('Temp: ' + cur[i].minTemp);

       let $tempMaxLi = $('<li>');
       $tempMaxLi.text('Temp: ' + cur[i].maxTemp);

       let $humLi = $('<li>');
       $humLi.text('Humidity: ' + cur[i].humidity);

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

  function getUvIndex() {
    if (test) { console.log('getUvIndex'); }
    // function to color uv index
    let title = '<span>UV Index: </span>';
    let color = title + '<span style="background-color: blue; padding: 0 7px 0 7px;">5</span>';
    //TODO logic for color
    // $(this).attr('background-color',color);
  return color;
  };

  // weather icon??? part of api?

  function getHistory () {
  // function to pull city history from local memory
    if (test) { console.log('getHistory'); }
    let historyArr = [];

    return historyArr;
  };

});