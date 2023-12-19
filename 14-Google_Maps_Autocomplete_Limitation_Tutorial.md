
# Limiting Google Maps Autocomplete API Results to a Specific Area

## Introduction
In this tutorial, we'll learn how to restrict the Google Maps Autocomplete API results to a specific area. This is particularly useful when you want to narrow down search results to a specific region or locality. We'll use the example of limiting searches to only include results from Coogee in New South Wales (NSW), Australia.

## Problem
The challenge is to refine the Autocomplete search results so that when a user types 'Coogee', they only see results from Coogee in NSW, rather than Coogee in other regions like Western Australia (WA).

## Solution
The solution involves using the `strictBounds` option along with `bounds` in the Autocomplete API. We define the geographical boundaries of NSW to limit our search results.

You cant test and run it: [Example](https://jsfiddle.net/geocodezip/sdwb3agy/2/)

## Step-by-Step Guide

📍[Google documentation](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#ComponentRestrictions)

### 1. HTML Setup
First, we need an input field in our HTML where users can type their search queries.

```html
<input id="inputSuburb" type="text" placeholder="Enter a location" value="coogee"/>
<div id="map"></div>
<div id="infowindow-content">
  <span id="place-name" class="title"></span><br />
  <span id="place-address"></span>
</div>
```

### 2. JavaScript Configuration
In your JavaScript, set up the Autocomplete object with the desired options.

```javascript
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 40.749933, lng: -73.98633},
    zoom: 13,
    mapTypeControl: false,
  });

  // Define the bounds for NSW
  const nswBounds = {
    south: -37.5052801,
    west: 140.9992793,
    north: -28.15702,
    east: 159.1054441
  };

  // Set up the autocomplete with strict bounds
  const input = document.getElementById('inputSuburb');
  const options = {
    fields: ["address_components", "geometry", "types", "name"],
    strictBounds: true,
    bounds: nswBounds,
    componentRestrictions: { country: 'au' },
    types: ['locality', 'postal_code']
  };

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  // Additional code to handle the selection of a place
  autocomplete.addListener('place_changed', function() {
    const place = autocomplete.getPlace();
    console.log(place);
    // Additional logic to handle the place selection
  });
}

window.initMap = initMap;
```

### 3. Loading the Google Maps Script
Include the Google Maps script in your HTML with your API key.

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=places&v=weekly" defer></script>
```

Replace `YOUR_API_KEY` with your actual Google Maps API key.

## Conclusion
This setup will ensure that the Autocomplete results are strictly within the bounds of NSW, Australia, effectively limiting results to the desired area.

---

This tutorial is based on a problem and solution discussed on Stack Overflow. For more details, refer to the original post.
