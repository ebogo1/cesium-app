import {
  ArcGisMapService,
  Cesium3DTileset,
  Cesium3DTileStyle,
  Color,
  Credit,
  defined,
  GeoJsonDataSource,
  Ion,
  Terrain,
  Math,
  Cartesian3,
  Viewer
} from "cesium";
import "cesium/Widgets/widgets.css";
import "../src/css/main.css";
import { queryFeatures } from "@esri/arcgis-rest-feature-service";
import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { tokens } from './tokens.js'

// ArcGIS authentication
ArcGisMapService.defaultAccessToken = tokens.arcGisToken;
const authentication = ApiKeyManager.fromKey(tokens.arcGisToken);

// Ion authentication
Ion.defaultAccessToken = tokens.ionToken;

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer("cesiumContainer", {
  terrain: Terrain.fromWorldTerrain(),
});
const scene = viewer.scene;
scene.globe.depthTestAgainstTerrain = true;
scene.msaaSamples = 4;

// Set camera to look at Manhattan
scene.camera.flyTo({
  destination: new Cartesian3(1347533.5302324062, -4687939.175356956, 4140986.248928899),
  orientation: {
    heading: 6.283185307179586,
    pitch: -0.7898820677307645
  },
});

// Add Cesium OSM Buildings, a global 3D buildings layer
const osmBuildingsTileset = scene.primitives.add(
  await Cesium3DTileset.fromIonAssetId(96188),
);
osmBuildingsTileset.style = new Cesium3DTileStyle({
  color: {
    conditions: [
      [
        "${feature['building']} === 'apartments' || ${feature['building']} === 'residential'",
        "color('DEEPSKYBLUE', 1.0)",
      ],
      [true, "color('BLANCHEDALMOND')"]
    ],
  },
});
scene.primitives.add(osmBuildingsTileset);

// Add ArcGIS data source for NYC street safety ratings
const lineLayerName = "New York City Safe Streets for Seniors";
const lineLayerURL = "https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/"+lineLayerName+"/FeatureServer/0";
let dataSource;

queryFeatures({
  url: lineLayerURL,
  authentication,
  f:"geojson"
}).then((response) => {
  GeoJsonDataSource.load(response, {
    clampToGround:true,
    strokeWidth: 3,
    // Attribution text retrieved from https://arcgis.com/home/item.html?id=2d6faae4a1064df8b37383bad3a1ea75
    credit: new Credit("New York City Department of Transportation", false)
  }).then((data) => {
    const lineColorsByType = {
      POOR: Color.CRIMSON,
      FAIR: Color.LIGHTPINK,
      GOOD: Color.PALETURQUOISE,
      NR: Color.BLACK
    };

    const entities = data.entities.values;
    entities.forEach((entity) => {
      const rating = entity.properties.RatingWord?.getValue();
      if (defined(rating) && defined(lineColorsByType[rating])) {
        entity.polyline.material = lineColorsByType[rating];
      }
    });
    viewer.dataSources.add(data);
    dataSource = data;
  });
});

// Photogrammetry pedestrian bridge
const bridgeTileset = scene.primitives.add(
  await Cesium3DTileset.fromIonAssetId(3810079),
);
bridgeTileset.show = false;

// Keyboard controls
document.addEventListener("keydown", function (e) {
  switch (e.code) {
    case "Digit1":
      dataSource.show = true;
      scene.camera.flyTo({
        destination: new Cartesian3(1338014.7819664748, -4648294.338950078, 4144317.058669202),
        orientation: {
          heading: Math.toRadians(-50),
          pitch: Math.toRadians(-45),
        },
      });
      break;
    case "Digit2":
      dataSource.show = true;
      scene.camera.flyTo({
        destination: new Cartesian3(1337357.7991043585, -4647744.238790143, 4144220.732057952),
        orientation: {
          heading: 5.432704684199063,
          pitch: -0.09976568605045566,
        },
      });
      break;
    case "Digit3":
      dataSource.show = false;
      bridgeTileset.show = true;
      scene.camera.flyTo({
        destination: new Cartesian3(1337297.5079792712, -4647735.521303585, 4144247.252718755),
        orientation: {
          heading: 1.940941209462446,
          pitch: -0.15242058990987584,
        },
      });
      break;
    case "Digit0":
      bridgeTileset.show = !bridgeTileset.show;
      break;
    default:
  }
});
