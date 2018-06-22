$(document).on('click', '#eatDrop a', function() {
    var poodle = $(this).children('span').text();
    $('#quisineType').val(poodle);
    console.log(this);
    console.log($(this).children('span').text());
});

$(document).on('click', '#priceDrop a', function() {
    var poodle = $(this).children('span').text();
    $('#priceType').val(poodle);
    console.log(this);
    console.log($(this).children('span').text());
});

$(document).on('click', '#rangeDrop a', function() {
    var poodle = $(this).children('span').text();
    $('#rangeType').val(poodle);
    console.log(this);
    console.log($(this).children('span').text());
});

$("#submit-button").on("click", function() {

    event.preventDefault();

    var range = $("#rangeType").val().trim(); console.log(range);
    var convertedRange = 0;
    var price = $("#priceType").val().trim();
    var convertedPrice = 0;
    var cuisine = $("#quisineType").val().trim();
    var convertedCuisine = 0;
    var latitue = "";
    var longitude = "";
    var matchingRestaurants = [];
    var threeRestaurantPicks = [];

    function convertRange (range) {
       if (range === "A few minutes away") {
           convertedRange = 3000;
       } else if (range === "A short drive") {
           convertedRange = 8000;
       } else if (range === "Somewhere in town") {
           convertedRange = 16000;
       } else if (range === "A half hour or more") {
           convertedRange = 80000;
       };
    };

    convertRange (range); console.log(convertedRange);

    function convertPrice (price) {
        if (price === "Cheap") {
            convertedPrice = 1;
        } else if (price === "Moderate") {
            convertedPrice = 2;
        } else if (price === "A Good Time") {
            convertedPrice = 3; 
        } else if (price === "A REALLY Good Time")
            convertedPrice = 4;
    };

    convertPrice (price); console.log(convertedPrice);

    function convertCuisine (cuisine) {
        if (cuisine === "Italian") {
            convertedCuisine = 55;
        } else if (cuisine === "Mexican") {
            convertedCuisine = 73;
        } else if (cuisine === "Chinese") {
            convertedCuisine = 25;
        } else if (cuisine === "American") {
            convertedCuisine = 1;
        } else if (cuisine === "Pizza") {
            convertedCuisine = 82;
        }   else if (cuisine === "Burger") {
            convertedCuisine = 168;
        } else if (cuisine === "Japanese") {
            convertedCuisine = 60;
        } else if (cuisine === "Seafood") {
            convertedCuisine = 83;
        } else if (cuisine === "Vegetarian") {
            convertedCuisine = 308;   
        } else if (cuisine === "Bar Food") {
            convertedCuisine = 227;
        } else if (cuisine = "BBQ") {
            convertedCuisine = 193;
        } else if (cuisine = "Indian") {
            convertedCuisine = 148;
        };
    };

    convertCuisine (cuisine); console.log (convertedCuisine);

    var queryGoogleUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBClQb1B-kxEPNM2zmAfCB2OcwWXawrHEw";
    
    $.ajax ({
        url: queryGoogleUrl, 
        method: 'POST'
    }).then(function(response) {
        
        latitude = response.location.lat;
        longitude = response.location.lng;

        var queryZomatoUrl = "https://developers.zomato.com/api/v2.1/search?lat=" + latitude + "&lon=" + longitude + "&radius=" + convertedRange + "&cuisines=" + convertedCuisine;

        $.ajax ({
            url: queryZomatoUrl,
            method: "GET",
            beforeSend: function(xhr){xhr.setRequestHeader("user-key", "86cbec6f776752992f95624705a3b128");}
        }) .then(function(response) {

            matchingRestaurants.length = 0;

            for (i=0; i < response.restaurants.length; i++) {
                
                if (response.restaurants[i].restaurant.price_range === convertedPrice) {
                    
                    matchingRestaurants.push(response.restaurants[i]);  console.log(matchingRestaurants)

                };

            };

            function pickThreeLocations () {

                threeRestaurantPicks.length = 0;

                if (matchingRestaurants.length > 2) {

                    for (i=0; threeRestaurantPicks.length < 3;) {

                        var thingy = matchingRestaurants[Math.floor(Math.random() * matchingRestaurants.length)];

                        console.log(thingy);

                        if (threeRestaurantPicks.indexOf(thingy) === -1) {

                            threeRestaurantPicks.push(thingy); 

                        } 

                        console.log(threeRestaurantPicks);

                    };

                } else if (matchingRestaurants.length === 2) {

                    threeRestaurantPicks.push(matchingRestaurants[0]);

                    threeRestaurantPicks.push(matchingRestaurants[1]);

                } else if (matchingRestaurants.length === 1) {
                    
                    threeRestaurantPicks.push(matchingRestaurants[0]);

                } else {

                    var noResults = $("<div>").text("Sorry no matching results!");

                    console.log("No results!")

                }
                
            };

            pickThreeLocations ();

            
            
        });
        
    }); 

});
