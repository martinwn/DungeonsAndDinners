var config = {
    apiKey: "AIzaSyDIJxOczwNeRzwdUa96kJDtO0AQ48hX8m0",
    authDomain: "dungeonsanddinners.firebaseapp.com",
    databaseURL: "https://dungeonsanddinners.firebaseio.com",
    projectId: "dungeonsanddinners",
    storageBucket: "dungeonsanddinners.appspot.com",
    messagingSenderId: "395732337799"
  };

firebase.initializeApp(config);

var database = firebase.database();
var provider = new firebase.auth.GoogleAuthProvider();

//global variables for favorites
var globalUID = ""; 
var userLoggedIn = false;
var favoritesShowing = false;
var favoritesLocal = []; 

$("#loginHere").on("click", function(event) {

    console.log("login clicked");

    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log("user: " + user.name);
        console.log("email: " + user.email);
        // ...
        console.log("userID: " + user.userid);
        console.log("userToken: " + token);
    }).catch(function(error) {

        console.log("hitting error");
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log("errorcode: " + errorCode + " errormessage: " + errorMessage + " email: " + email + " credential: " + credential);
        // ...
    });

});

$("#signOutButton").on("click", function(event) {

    console.log("signout clicked");

    userLoggedIn = false;

    firebase.auth().signOut().then(function() {
        console.log("Signed-out"); //Sign-out successful.
    }).catch(function(error) {
        console.log("Error trying to sign out"); // An error happened.
    });

});

firebase.auth().onAuthStateChanged(function(user) {

    if (user) {

        var user = firebase.auth().currentUser;
        var name, email, photoUrl, uid, emailVerified;

        console.log("seeing user");
        // photoUrl = "blank";

        if (user != null) {

            console.log("seeing user variables");

            userLoggedIn = true; //favorite toggler

            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                            // this value to authenticate with your backend server, if
                            // you have one. Use User.getToken() instead.
            console.log("name: " + name + " email: " + email + " photoUrl: " + photoUrl + " verified: " + emailVerified + " uid: " + uid );
            var userRef = firebase.database().ref("users/" + uid);
            globalUID = userRef;
            console.log("globalUID" + globalUID);
                
                if (!userRef.firstLogin) {
                    console.log("First Login");
                    userRef.update({
                        name: name,
                        email: email,
                        userid: uid,
                        firstLogin: true,
                    });
                };

                   //database listener for favorites list

                   userRef.on("value", function(snapshot) { 

                    favoritesLocal = snapshot.val().favoritesListDB;

                    if (!Array.isArray(favoritesLocal)) {
                        favoritesLocal = [];
                    }

                });


            $('#userLoggedIn').show();
            $('#signOutButton').show();
            $('#loggedInUser').html('<i class="fas fa-user-circle"></i> ' + email);
            $("#loginHere").hide();

        };

    // User is signed in.

    } else {

        $("#loginHere").show();
        $('#loggedInUser').html('');
        $("#userLoggedIn").hide();
        $("#signOutButton").hide();

        // No user is signed in.
    };

});

// Dropdown Functionality 
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

// On Click Function To Find Random Restaurant
$("#findMeAPlace").on("click", function() {

    event.preventDefault();

    //adding favorites functionality

    favoritesShowing = false;

    $('#favoritesBox').hide();



    var rangeArray = [1610, 4900, 16090, 80460];
    var rangeObj = {
        "One Mile": 1610,
        "Three Miles": 4900,
        "Ten Miles": 16090,
        "Fifty Miles": 80460,
        "": rangeArray[Math.floor(Math.random() * rangeArray.length)]
    };
    var cuisineArray = [55, 73, 25, 1, 82, 168, 60, 83, 308, 227, 193, 148];
    var cuisineObj = {
        "Italian": 55,
        "Mexican": 73,
        "Chinese": 25,
        "American": 1,
        "Pizza": 82,
        "Burgers": 168,
        "Japanese": 60,
        "Seafood": 83,
        "Vegetarian": 308,
        "Bar": 227,
        "BBQ": 193,
        "Indian": 148,
        "": cuisineArray[Math.floor(Math.random() * cuisineArray.length)]
    };
    var price = $("#priceType").val().trim(); 
    var latitude = "";
    var longitude = "";
    var matchingRestaurants = [];
    var threeRestaurantPicks = [];
    var oneRestaurantPick = [];

    $('#favorite').removeClass('favorited');

        $("#currentCuisine").text($("#quisineType").val().trim());

        var queryGoogleUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBClQb1B-kxEPNM2zmAfCB2OcwWXawrHEw";
        
        $.ajax ({
            url: queryGoogleUrl, 
            method: 'POST'
        }).then(function(response) {
            
            latitude = response.location.lat;
            longitude = response.location.lng;

            var queryZomatoUrl = "https://developers.zomato.com/api/v2.1/search?lat=" + latitude + "&lon=" + longitude + "&radius=" + rangeObj[$("#rangeType").val().trim()] + "&cuisines=" + cuisineObj[$("#quisineType").val().trim()];

            $.ajax ({
                url: queryZomatoUrl,
                method: "GET",
                beforeSend: function(xhr){xhr.setRequestHeader("user-key", "86cbec6f776752992f95624705a3b128");}
            }).then(function(response) {

                // Filters Ajax Results To Comply With Price Input 
                matchingRestaurants.length = 0;
                    
                    for (i=0; i < response.restaurants.length; i++) {

                        if (price === "") {

                            matchingRestaurants.push(response.restaurants[i]);  

                        } else if (price === "Cheap" && response.restaurants[i].restaurant.average_cost_for_two < 21) {
                            
                            matchingRestaurants.push(response.restaurants[i]);  

                        } else if (price === "Moderate" && response.restaurants[i].restaurant.average_cost_for_two > 20 && response.restaurants[i].restaurant.average_cost_for_two < 31) {

                            matchingRestaurants.push(response.restaurants[i]);  

                        } else if (price === "A Good Time" && response.restaurants[i].restaurant.average_cost_for_two > 30 && response.restaurants[i].restaurant.average_cost_for_two < 51) {

                            matchingRestaurants.push(response.restaurants[i]);  

                        } else if (price === "A REALLY Good Time" && response.restaurants[i].restaurant.average_cost_for_two > 50) {

                            matchingRestaurants.push(response.restaurants[i]); 

                        };

                    };

                // Randomly Sets Three Restaurant Objects From matchingRestaurants In A New Array
                function pickThreeLocations () {

                    threeRestaurantPicks.length = 0;

                    if (matchingRestaurants.length > 2) {

                        for (i=0; threeRestaurantPicks.length < 3;) {

                            var thingy = matchingRestaurants[Math.floor(Math.random() * matchingRestaurants.length)];

                            if (threeRestaurantPicks.indexOf(thingy) === -1) {

                                $("#noResults").hide();

                                threeRestaurantPicks.push(thingy); 

                            }; 

                        };

                    } else if (matchingRestaurants.length === 2) {

                        $("#noResults").hide();

                        threeRestaurantPicks.push(matchingRestaurants[0]);

                        threeRestaurantPicks.push(matchingRestaurants[1]);

                    } else if (matchingRestaurants.length === 1) {

                        $("#noResults").hide();
                        
                        threeRestaurantPicks.push(matchingRestaurants[0]);

                    } else {

                        $('#mainRandomResult').hide();

                        $("#noResultsBox").text("No Results found for that Input!");

                        $("#noResults").show();

                        console.log("No results!")

                    };
                    
                };

                pickThreeLocations ();    

                // Randomly Sets One Restaurant Obect From threeRestaurantPicks To A New Array
                if (threeRestaurantPicks.length > 0) {

                    function pickOneLocation () {

                        oneRestaurantPick.length = 0;

                        var thingy = threeRestaurantPicks[Math.floor(Math.random() * pickThreeLocations.length)];
        
                        oneRestaurantPick.push(thingy);
        
                    };
        
                };

                pickOneLocation ();

                // Writes Restaurant Information From OnRestaurantPick Array Object To HTML
                function writeRestaurantToCard (oneRestaurantPick) {

                    $("#mainRestaurantName").text(oneRestaurantPick[0].restaurant.name);

                    $("#mainAddress").text(oneRestaurantPick[0].restaurant.location.address);

                    $("#mainCuisineType").text(oneRestaurantPick[0].restaurant.cuisines);

                    if (price === "Cheap") {
                        
                        $("#mainPriceResult").text("$");
                        $("#favorite").attr("dataPrice", "$");


                    } else if (price === "Moderate") {
                        
                        $("#mainPriceResult").text("$$");
                        $("#favorite").attr("dataPrice", "$$");

                    } else if (price === "A Good Time") {
                        
                        $("#mainPriceResult").text("$$$");
                        $("#favorite").attr("dataPrice", "$$$");


                    } else if (price === "A REALLY Good Time") {
                        
                        $("#mainPriceResult").text("$$$$");
                        $("#favorite").attr("dataPrice", "$$$$");

                    }; 

                    // Adding Link To Menu
                    $("#linkMenu").attr("href", oneRestaurantPick[0].restaurant.menu_url);

                    // Adding Functionality To Reroll Button
                    $(document).on("click", "#reroll", function() {

                        if (threeRestaurantPicks.length === 1) {

                            $("#noResultsBox").text("Only 1 Result For That Input!");

                            $("#noResults").show();

                        } else {

                            pickThreeLocations ();
                            pickOneLocation ();
                            writeRestaurantToCard (oneRestaurantPick);
                            $('#favorite').removeClass('favorited');

                        };
                        
                    });

                    // Writing Image To HTML If Available
                    if (oneRestaurantPick[0].restaurant.featured_image !== "") {

                        $("#mainVenuePic").attr("src", oneRestaurantPick[0].restaurant.featured_image);

                        $("#mainVenuePic").show();

                    } else {

                        $("#mainVenuePic").hide();

                    };

                    // Adding Phone Number If Available
                    $("#phoneNumber").attr("href", "tel:+" + oneRestaurantPick[0].restaurant.phone_numbers)

                    $("#phoneNumber").text(oneRestaurantPick[0].restaurant.phone_numbers);

                    // Adding Functionality To Directions Button With Google Maps
                    var googleUrl = "https://www.google.com/maps/search/?api=1&query=" + oneRestaurantPick[0].restaurant.location.latitude + "," + oneRestaurantPick[0].restaurant.location.longitude;

                    $("#linkDirections").attr("href", googleUrl);

                    // Writing User Rating To HTML
                    $("#userRating").text(oneRestaurantPick[0].restaurant.user_rating.aggregate_rating);

                    $("#userRating").css("backgroundColor", "#" +  oneRestaurantPick[0].restaurant.user_rating.rating_color);
                
                    //adding all of these for favorites use
                    $("#favorite").attr("dataValue", oneRestaurantPick[0].restaurant.id);
                    $("#favorite").attr("dataName", oneRestaurantPick[0].restaurant.name);
                    $("#favorite").attr("dataAddress", oneRestaurantPick[0].restaurant.location.address);
                    $("#favorite").attr("dataCuisine", oneRestaurantPick[0].restaurant.cuisines);
                    $("#favorite").attr("dataMenu", oneRestaurantPick[0].restaurant.menu_url);

                    //checking to see if favorite already exists
                    for (x=0; x<favoritesLocal.length; x++){
                        
                        if (oneRestaurantPick[0].restaurant.id == favoritesLocal[x].restID) {

                            console.log("Restaurant already a favorite at index: " + favoritesLocal[x].dataIndex);

                            $("#favorite").addClass("favorited");
                            $('#favorite').attr("dataIndex", favoritesLocal[x].dataIndex);
                            
                        };
                    };

                    $('#mainRandomResult').show();

                };
                
                writeRestaurantToCard (oneRestaurantPick);
                
            });
            
        }); 

});

//building favorites code
$(document).on("click", "#favorite", function() {

    if (userLoggedIn === true) {

        if (!$(this).hasClass("favorited")) {

            $(this).addClass("favorited");
            var favValue =  $(this).attr("dataValue");
            var favName = $(this).attr("dataName");
            var favAddress = $(this).attr("dataAddress");
            var favCuisine = $(this).attr("dataCuisine");
            var favMenu = $(this).attr("dataMenu");
            var favPrice = $(this).attr("dataPrice");

            var favIndex = favoritesLocal.length;
            var favoritesObj = {};

            favoritesObj['restID'] = favValue;
            favoritesObj['restName'] = favName;
            favoritesObj['restAddress'] = favAddress;
            favoritesObj['restCuisine'] = favCuisine;
            favoritesObj['restMenu'] = favMenu;
            favoritesObj['restPrice'] = favPrice;
            favoritesObj['dataIndex'] = favIndex;

            console.log('FavoritesOBJ: ' + favoritesObj);

            console.log("favoritesLocal: " + favoritesLocal);

            favoritesLocal.push(favoritesObj);

            console.log("favoritesLocal after push: " + favoritesLocal);

            globalUID.update({
                favoritesListDB: favoritesLocal,
            });
            
            $(this).attr("dataIndex", favIndex);
            
        } else {
            
            $(this).removeClass("favorited")
            
            var deleteFavorites = favoritesLocal;
            var currentIndex = $(this).attr("dataIndex");

            // Deletes the item marked for deletion
            deleteFavorites.splice(currentIndex, 1);
            favoritesLocal = deleteFavorites;

            //fixing our data Indexes so they're accurate
            for ( x=0; x<favoritesLocal.length; x++ ){

                favoritesLocal[x].dataIndex = x;

            };
        
            globalUID.update({
                favoritesListDB: favoritesLocal,
            });

            console.log(favorites)
        
            //displayFavorites(); //this should only go off if favoritesShowing === true
            //it's to redraw displayed favorites to keep the displayed dataIndexes from being off
        }

    } else {
        console.log("user must be signed in for favorites");
    }

});

$(document).on("click", "#favoriteNav", function() {

    favoritesShowing = true;

    $('#favoritesBox').show();
    $('#mainRandomResult').hide();
    $('#noResults').hide();


});

function displayFavorites(){

    if (favoritesShowing === true) {

        event.preventDefault();            

        $("#favoritesBox").empty();
    
    
        for (var i = 0; i < favoritesLocal.length; i++) {
    
            var writeRestId = favoritesLocal[i].restID;
            var writeRestName = favoritesLocal[i].restName;
            var writeRestAddress = favoritesLocal[i].restAddress;
            var writeRestCuisine = favoritesLocal[i].restCuisine;
            // var writeRestMenu = favoritesLocal[i].restMenu;
            var writeRestPrice = favoritesLocal[i].restPrice;
            var writeDataIndex = favoritesLocal[i].dataIndex;
    
            var favoriteBoxDiv = $('<div class="card" style="width: 18rem;"><div class="card-header text-right"><span class="text-right"></span><i class="fas fa-star favorited" id="favorite" dataValue="'+writeRestId+'" dataIndex='+writeDataIndex+'></i></div><div class="card-body"><h5 class="card-title">'+writeRestName+'</h5><p class="card-text">'+writeRestAddress+'</p><p class="card-text">'+writeRestPrice+'</p></div><div class="card-footer"><small class="text-muted">'+writeRestCuisine+'</small></div></div>")');
    
            $("#favoritesBox").append(favoriteBoxDiv);
    
        }
    }
}






