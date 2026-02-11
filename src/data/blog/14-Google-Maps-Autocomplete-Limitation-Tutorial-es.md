---
title: "Limitar resultados de Google Maps Autocomplete a una zona especifica"
author: "Francisco Gonzalez"
description: "Como restringir resultados del Autocomplete de Google Maps a un area geografica concreta con JavaScript."
pubDate: 2024-02-05
image:
  url: "https://docs.astro.build/assets/full-logo-light.png"
  alt: "The full Astro logo."
tags: ["javascript", "web-development"]
category: web-development
translationKey: post-14
lang: es
---

<!-- # Limitar resultados de Google Maps Autocomplete a un area especifica -->

## Introduccion

En este tutorial veremos como restringir los resultados de Google Maps Autocomplete a una zona especifica. Usaremos el caso de mostrar solo resultados de Coogee en New South Wales (NSW), Australia.

## Problema

Cuando el usuario escribe "Coogee", queremos evitar resultados de otras regiones (por ejemplo WA) y mostrar solo NSW.

## Solucion

Usaremos `strictBounds` junto con `bounds` para definir el area geografica permitida.

Puedes probar el ejemplo aqui: [Example](https://jsfiddle.net/geocodezip/sdwb3agy/2/)

## Paso a paso

📍[Google documentation](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#ComponentRestrictions)

### 1. Estructura HTML

```html
<input id="inputSuburb" type="text" placeholder="Enter a location" value="coogee"/>
<div id="map"></div>
<div id="infowindow-content">
  <span id="place-name" class="title"></span><br />
  <span id="place-address"></span>
</div>
```

### 2. Configuracion JavaScript

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

### 3. Cargar el script de Google Maps

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=places&v=weekly" defer></script>
```

Reemplaza `YOUR_API_KEY` por tu API key real.

## Conclusion

Con esta configuracion, Autocomplete devolvera resultados dentro de los limites de NSW, Australia.

---

Este tutorial se basa en un problema y solucion compartidos en Stack Overflow.
