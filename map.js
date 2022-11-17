var wms_layer = L.LayerGroup();
var islayed = false;

function updateMap() {
  map.spin(false);
  // loader
  map.spin(true, { lines: 8, length: 30, width: 13, radius: 20, scale: 0.5, color: 'black' });

  // clear overlay
  if (islayed == true) {
    layerControl.removeLayer(wms_layer);
    map.removeLayer(wms_layer);
  }
  
  // Get user selection
  var dst = parseInt(document.getElementById('dataset').value);
  var variable = parseInt(document.getElementById('variable').value);
  var level = parseInt(document.getElementById('depth').value);
  var req_time = parseInt(document.getElementById('daterange').value);

  var lowval = parseFloat(document.getElementById('lowval').value);
  var highval = parseFloat(document.getElementById('highval').value);
     
  if (isNaN(lowval) || isNaN(highval) || (lowval>highval)) {
    var legend_url = dataset_config[dst]['url']+"request=GetLegendGraphic&layer="+dataset_config[dst]['vars'][variable]+"&bgcolor=0xffffff";
    wms_layer = L.tileLayer.wms(dataset_config[dst]['url'], {
      //attribution: 'TAMU/UMD',    
      crs: L.CRS.EPSG4326,
      format: 'image/png',
      layers: dataset_config[dst]['vars'][variable],
      belowmincolor: 'transparent',
      abovemaxcolor: 'transparent',
      time: dataset_config[dst]['daterange'][req_time],
      elevation: String(dataset_config[dst]['levels'][level]),
      transparent: true,
      version: '1.1.1'
    }).addTo(map);
  }
  else {
    var legend_url = dataset_config[dst]['url']+"request=GetLegendGraphic&layer="+dataset_config[dst]['vars'][variable]+"&colorscalerange="+String(lowval)+","+String(highval)+"&bgcolor=0xffffff";
    wms_layer = L.tileLayer.wms(dataset_config[dst]['url'], {
      //attribution: 'TAMU/UMD',    
      crs: L.CRS.EPSG4326,
      format: 'image/png',
      layers: dataset_config[dst]['vars'][variable],
      belowmincolor: 'transparent',
      abovemaxcolor: 'transparent',
      time: dataset_config[dst]['daterange'][req_time],
      elevation: String(dataset_config[dst]['levels'][level]),
      colorscalerange: [lowval, highval],
      transparent: true,
      version: '1.1.1'
    }).addTo(map);
  }
  console.log(legend_url);
  //legend
  document.getElementById("colorbar").innerHTML = "<img id=\"imgL\"src=\"" + legend_url + "\" alt=\"legend here\" title=\"legend\">";

  //spin 
  wms_layer.on('loading', function (e) {
    map.spin(true, { lines: 8, length: 30, width: 13, radius: 20, scale: 0.5, color: 'black' });
  });

  wms_layer.on('load tileerror tileabort', function (e) {
    //console.log("tiles loaded");
    map.spin(false);
  });

  //wms_layer.setOpacity(0.6);
  layerControl.addOverlay(wms_layer, "User request")
  islayed = true;
}

function initDemoMap() {
  //BASE TILE LAYER 1
  var Esri_Ocean = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
  });
  //BASE TILE LAYER 2
  var Esri_World = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
  );
  //BASE TILE GROUP LAYER
  var baseLayers = {
    "Ocean": Esri_Ocean,
    "Satelite ": Esri_World
  };
  //MAP STRUCTURE
  var map = L.map('map', {
    layers: [Esri_Ocean],
    minZoom: 2,
    worldCopyJump: false,
    inertia: false
  });

  var layerControl = L.control.layers(baseLayers);
  layerControl.addTo(map);

  map.setView([25, -20], 3);
  L.control.mousePosition().addTo(map);
  //INIT RETURN FUNCTION
  return {
    map: map,
    layerControl: layerControl
  };
}

// MAP CREATION
var mapStuff = initDemoMap();
var map = mapStuff.map;
var layerControl = mapStuff.layerControl;
