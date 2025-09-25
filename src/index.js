import {
  Ion,
  Viewer,
  Terrain,
  createOsmBuildingsAsync,
  Cartesian3,
  Math,
} from "cesium";
import "cesium/Widgets/widgets.css";
import "../src/css/main.css";

// Your access token can be found at: https://cesium.com/ion/tokens.
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZGYxOGNkNy05NzBhLTRmYTMtYjlhMC1hYWVhYmQ3N2ZiMTQiLCJpZCI6MzQ0MzMyLCJpYXQiOjE3NTg3NDQwMjJ9.MP0PIzbZUW7unPKTVVNiSmY0At_VmjixA2BilhuF7Ls";

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer("cesiumContainer", {
  terrain: Terrain.fromWorldTerrain(),
});

// Add Cesium OSM Buildings, a global 3D buildings layer.
const tileset = viewer.scene.primitives.add(
  await Cesium.Cesium3DTileset.fromIonAssetId(96188),
);
viewer.scene.primitives.add(buildingTileset);

// Fly the camera to San Francisco at the given longitude, latitude, and height.
viewer.camera.flyTo({
  destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
  orientation: {
    heading: Math.toRadians(0.0),
    pitch: Math.toRadians(-15.0),
  },
});