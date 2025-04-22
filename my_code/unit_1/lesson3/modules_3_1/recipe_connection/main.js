"use strict";

const cities = require("cities"); 
// Imports the "cities" module, which allows you to look up city information using zip codes.

var myCity = cities.zip_lookup("10016"); 
// Uses the zip_lookup function from the cities module to find information 
// about the city with the ZIP code "10016" (New York, NY).

console.log(myCity); 
// Displays the city information (such as city name, state, and latitude/longitude) in the console.
