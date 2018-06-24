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
var favoritesLocal = {}; 

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
    // photoUrl = "blank";

    if (user != null) {

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
        globalUID = firebase.database().ref("users/" + uid + "/favorites");
            
            if (!userRef.firstLogin) {
                 userRef.update({
                    name: name,
                    email: email,
                    characterName: "PizzaEater",
                    userid: uid,
                    firstLogin: false,
                    currentXP: 0,
                    toNextLevel: 100,
                    currentLevel: 1,
                    currentClass: 'Trainee',
                    lastLogin: '06062018',
                    questTimer: 000000,
                    characterWealth: "1",
                    characterFortitude: "10",
                    characterMind: "10",
                    characterStrength: "10",
                });
            }


        $('#userLoggedIn').show();
        $('#signOutButton').show();
        $('#loggedInUser').html('<i class="fas fa-user-circle"></i> ' + email);
        $("#loginHere").hide();

    }


    // User is signed in.
} else {

        $("#loginHere").show();
        $('#loggedInUser').html('');
        $("#userLoggedIn").hide();
        $("#signOutButton").hide();

    // No user is signed in.
}
});


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

$("#findMeAPlace").on("click", function() {

    event.preventDefault();

    var range = $("#rangeType").val().trim(); 
    var convertedRange = 0;
    var cuisineList = ["Italian", "Mexican", "Chinese", "American", "Pizza", "Burgers", "Japanese", "Seafood", "Vegetarian", "Bar", "BBQ", "Indian"]
    var cuisine = $("#quisineType").val().trim();
    var cuisineEmpty = "";
    var convertedCuisine = 0;
    var price = $("#priceType").val().trim(); 
    var latitude = "";
    var longitude = "";
    var matchingRestaurants = [];
    var threeRestaurantPicks = [];
    var oneRestaurantPick = [];

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

    convertRange (range); 

    function convertCuisine (cuisine) {
      
        if (cuisine === "") {
            cuisineEmpty = cuisineList[Math.floor(Math.random() * cuisineList.length)];
        } else if (cuisine === "Italian") {
            convertedCuisine = 55;
        } else if (cuisine === "Mexican") {
            convertedCuisine = 73;
        } else if (cuisine === "Chinese") {
            convertedCuisine = 25;
        } else if (cuisine === "American") {
            convertedCuisine = 1;
        } else if (cuisine === "Pizza") {
            convertedCuisine = 82;
        } else if (cuisine === "Burger") {
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

    if (convertedRange === 0 || price === "") {
        
        $("#noResultsBox").text("Please enter a value for Cost and Distance")
        
        $("#noResults").show();

    } else {

    

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
                
                    if (price === "Cheap" && response.restaurants[i].restaurant.average_cost_for_two < 31) {
                        
                        matchingRestaurants.push(response.restaurants[i]);  console.log(matchingRestaurants)

                    } else if (price === "Moderate" && response.restaurants[i].restaurant.average_cost_for_two > 30 && response.restaurants[i].restaurant.average_cost_for_two < 61) {

                        matchingRestaurants.push(response.restaurants[i]);  console.log(matchingRestaurants);

                    } else if (price === "A Good Time" && response.restaurants[i].restaurant.average_cost_for_two > 60 && response.restaurants[i].restaurant.average_cost_for_two < 101) {

                        matchingRestaurants.push(response.restaurants[i]);  console.log(matchingRestaurants);

                    } else if (price === "A REALLY Good Time" && response.restaurants[i].restaurant.average_cost_for_two > 100) {

                        matchingRestaurants.push(response.restaurants[i]);  console.log(matchingRestaurants);

                    };

                };

            function pickThreeLocations () {

                threeRestaurantPicks.length = 0;

                if (matchingRestaurants.length > 2) {

                    for (i=0; threeRestaurantPicks.length < 3;) {

                        var thingy = matchingRestaurants[Math.floor(Math.random() * matchingRestaurants.length)];

                        console.log(thingy);

                        if (threeRestaurantPicks.indexOf(thingy) === -1) {

                            $("#noResults").hide();

                            threeRestaurantPicks.push(thingy); 

                        }; 

                        console.log(threeRestaurantPicks);

                    };

                } else if (matchingRestaurants.length === 2) {

                    $("#noResults").hide();

                    threeRestaurantPicks.push(matchingRestaurants[0]);

                    threeRestaurantPicks.push(matchingRestaurants[1]);

                } else if (matchingRestaurants.length === 1) {

                    $("#noResults").hide();
                    
                    threeRestaurantPicks.push(matchingRestaurants[0]);

                } else {

                    $("#noResultsBox").text("No Results found for that Input!");

                    $("#noResults").show();

                    console.log("No results!")

                }
                
            };

            pickThreeLocations ();    
            
            if (threeRestaurantPicks.length > 0) {

                function pickOneLocation () {

                    $("#currentCuisine").text(cuisine); 

                    oneRestaurantPick.length = 0;

                    var thingy = threeRestaurantPicks[Math.floor(Math.random() * pickThreeLocations.length)];
    
                    oneRestaurantPick.push(thingy);
    
                };
    
            };

            pickOneLocation (); console.log(oneRestaurantPick);

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

                } 

                // $("#mainVenuePic").attr("src", oneRestaurantPick[0].restaurant.photos_url);

                // $("#phoneNumber").attr("href", "tel:+" + oneRestaurantPick[0].restaurant.phone_numbers)

                $("#linkMenu").attr("href", oneRestaurantPick[0].restaurant.menu_url);

                $("#favorite").attr("dataValue", oneRestaurantPick[0].restaurant.id);

                $(document).on("click", "#reroll", function() {

                    pickThreeLocations ();
                    pickOneLocation ();
                    writeRestaurantToCard (oneRestaurantPick);

                });
              
                //adding all of these for favorites use

                $("#favorite").attr("dataValue", oneRestaurantPick[0].restaurant.id);
                $("#favorite").attr("dataName", oneRestaurantPick[0].restaurant.name);
                $("#favorite").attr("dataAddress", oneRestaurantPick[0].restaurant.location.address);
                $("#favorite").attr("dataCuisine", oneRestaurantPick[0].restaurant.cuisines);
                $("#favorite").attr("dataMenu", oneRestaurantPick[0].restaurant.menu_url);
            


            };
            
            writeRestaurantToCard (oneRestaurantPick);
            
        });
        
    }); 

};

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

            favoritesLocal.push(favoritesObj);


            globalUID.update({
                favoritesListDB: favoritesLocal,
            });
            
            $(this).attr("dataIndex", favIndex);
            
        } else {

            var deleteFavorites = favoritesLocal;
            var currentIndex = $(this).attr("dataIndex");

            // Deletes the item marked for deletion
            deleteFavorites.splice(currentIndex, 1);
            favoritesLocal = deleteFavorites;
        
            globalUID.update({
                favoritesList: favoritesObj,
            });

            //displayFavorites(); //this should only go off if favoritesShowing === true
            //it's to redraw displayed favorites to keep the displayed dataIndexes from being off
        }




    } else {
        console.log("user must be signed in for favorites");
    }

});

//database listener for favorites list

globalUID.on("value", function(snapshot) { 

    console.log("hitting DB listener for favorites");

    favoritesLocal == snapshot.val().favoritesList;
    console.log("favoriteslocal changed by database to: " + favoritesLocal);


});




