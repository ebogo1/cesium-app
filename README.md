Demo Cesium app showing residential building data from OSM Buildings next to NYC street safety data from the New York City Department of Transportation and ArcGIS.

### Instructions to run:
1. Clone the repo
2. In ./src/, create a file called "tokens.js" that exports your ArcGIS and Cesium Ion access tokens:
```
const tokens = {
  arcGisToken: "<ArcGISToken>",
  ionToken: "<IonToken>"
}
export { tokens };
```
3. Run `npm install`, `npm run build`, and `npm start`. The app should open in your default browser.

### Keyboard controls:

- "1": fly to an area with many residential buildings and poor to fair street safety
- "2": fly to an intersection nearby where a pedestrian bridge could be built
- "3": show the tiled 3D scanned bridge model and fly to a pedestrian POV
- "0": toggle whether the bridge model is shown
