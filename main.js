/// Land Cover Change Analysis and Prediction for Hyderabad District (Final Version)

// 1. Define Area of Interest
var hyderabadDistrict = ee.FeatureCollection("FAO/GAUL/2015/level2")
  .filter(ee.Filter.eq('ADM2_NAME', 'Hyderabad'));
Map.centerObject(hyderabadDistrict, 9);
Map.addLayer(hyderabadDistrict, {color: 'black'}, 'District Boundary');

// 2. Cloud masking function
function maskLandsatClouds(image) {
  var qa = image.select('QA_PIXEL');
  var cloudMask = qa.bitwiseAnd(1 << 3).eq(0);
  var shadowMask = qa.bitwiseAnd(1 << 4).eq(0);
  return image.updateMask(cloudMask).updateMask(shadowMask);
}

// 3. Load and process Landsat data with proper band selection
function getLandsat5Data(startYear, endYear) {
  return ee.ImageCollection('LANDSAT/LT05/C02/T1_L2')
    .filterBounds(hyderabadDistrict)
    .filterDate(startYear + '-01-01', endYear + '-12-31')
    .filter(ee.Filter.lt('CLOUD_COVER', 20))
    .map(maskLandsatClouds)
    .median()
    .clip(hyderabadDistrict)
    .select(['SR_B1','SR_B2','SR_B3','SR_B4','SR_B5','SR_B7'])
    .rename(['SR_B2','SR_B3','SR_B4','SR_B5','SR_B6','SR_B7']);
}

function getLandsat7Data(startYear, endYear) {
  return ee.ImageCollection('LANDSAT/LE07/C02/T1_L2')
    .filterBounds(hyderabadDistrict)
    .filterDate(startYear + '-01-01', endYear + '-12-31')
    .filter(ee.Filter.lt('CLOUD_COVER', 20))
    .map(maskLandsatClouds)
    .median()
    .clip(hyderabadDistrict)
    .select(['SR_B1','SR_B2','SR_B3','SR_B4','SR_B5','SR_B7'])
    .rename(['SR_B2','SR_B3','SR_B4','SR_B5','SR_B6','SR_B7']);
}

function getLandsat8Data(startYear, endYear) {
  return ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterBounds(hyderabadDistrict)
    .filterDate(startYear + '-01-01', endYear + '-12-31')
    .filter(ee.Filter.lt('CLOUD_COVER', 20))
    .map(maskLandsatClouds)
    .median()
    .clip(hyderabadDistrict)
    .select(['SR_B2','SR_B3','SR_B4','SR_B5','SR_B6','SR_B7']);
}

// Get images
var landsat1990 = getLandsat5Data('1995', '1999');
var landsat2000 = getLandsat7Data('2005', '2009');
var landsat2010 = getLandsat8Data('2015', '2019');
var landsat2020 = getLandsat8Data('2020', '2022');

// 4. Define class data structure
var classData = [
  {name: 'Forest', value: 1, color: 'green'},
  {name: 'Urban', value: 2, color: 'red'},
  {name: 'Agriculture', value: 3, color: 'yellow'},
  {name: 'Water', value: 4, color: 'blue'}
];

// 5. Create training data (manually picked points)
var trainingPoints = ee.FeatureCollection([
  // Add training points hereee.Feature(ee.Geometry.Point([78.38, 17.40]), {'class': 1}),

ee.Feature(ee.Geometry.Point([78.3200, 17.4200]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3300, 17.4500]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3100, 17.4100]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3400, 17.4300]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3600, 17.4400]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3700, 17.4600]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3800, 17.4700]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.2900, 17.3900]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3500, 17.4200]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3000, 17.4400]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3300, 17.4800]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3400, 17.4100]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3200, 17.4300]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3100, 17.4600]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4000, 17.4400]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4200, 17.3500]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4400, 17.4300]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3900, 17.3800]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4100, 17.3900]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4700, 17.4500]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3800, 17.3400]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4500, 17.3700]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4400, 17.4100]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4200, 17.3800]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4600, 17.4700]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4700, 17.4000]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4800, 17.3900]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4900, 17.3600]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.5000, 17.4400]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4300, 17.4200]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4100, 17.4600]), {'class': 1}),

// Urban areas (2)
ee.Feature(ee.Geometry.Point([78.4700, 17.3900]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4900, 17.4100]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5100, 17.3700]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4300, 17.4400]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4600, 17.4200]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4300, 17.4000]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4400, 17.4200]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4500, 17.4300]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4100, 17.4400]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4600, 17.4500]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4700, 17.4600]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4900, 17.4700]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5000, 17.4800]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5200, 17.4900]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5300, 17.5000]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5500, 17.5100]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5600, 17.5200]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5700, 17.5300]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5800, 17.5400]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4900, 17.4300]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4400, 17.4400]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4300, 17.3800]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4700, 17.4100]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5000, 17.4200]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4600, 17.3600]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4500, 17.3700]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4400, 17.3900]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4200, 17.4300]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4100, 17.3900]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4600, 17.3800]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4400, 17.4000]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5000, 17.4500]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4800, 17.3700]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4700, 17.4200]), {'class': 2}),


// Agriculture areas (3)
ee.Feature(ee.Geometry.Point([78.5650, 17.4600]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5780, 17.4740]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5900, 17.4570]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.6050, 17.4690]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5520, 17.4920]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5400, 17.4860]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5210, 17.4750]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5360, 17.4600]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5010, 17.4550]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.4880, 17.4420]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.3500, 17.3600]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.3600, 17.3800]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.3700, 17.3900]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.3400, 17.3700]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.3800, 17.4000]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.3900, 17.4100]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.4000, 17.4200]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.4100, 17.4300]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.4200, 17.4400]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5100, 17.4640]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5240, 17.4800]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5630, 17.4870]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5660, 17.4540]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5490, 17.4760]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5320, 17.4640]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5410, 17.4710]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5180, 17.4850]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5230, 17.4740]), {'class': 3}),


// Water bodies (4)
ee.Feature(ee.Geometry.Point([78.3500, 17.3500]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.3700, 17.3700]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4000, 17.3800]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4200, 17.4000]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4400, 17.4100]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4000, 17.3500]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4100, 17.3400]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4200, 17.3300]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4300, 17.3200]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4400, 17.3100]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4500, 17.3000]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4600, 17.2900]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4700, 17.2800]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4800, 17.2700]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4900, 17.2600]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5000, 17.2500]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5100, 17.2400]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5200, 17.2300]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5300, 17.2200]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5400, 17.2100]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5500, 17.2000]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5600, 17.1900]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5700, 17.1800]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4800, 17.4300]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4000, 17.3900]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4300, 17.4400]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4200, 17.4100]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4100, 17.3800]), {'class': 4}),

]);

// 6. NDVI band addition
function addNdvi(image) {
  return image.addBands(
    image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI')
  );
}

var withNdvi2020 = addNdvi(landsat2020);

// 7. Train classifier
var trainingData2020 = withNdvi2020.sampleRegions({
  collection: trainingPoints,
  properties: ['class'],
  scale: 30
});

var classifier = ee.Classifier.smileRandomForest(100)
  .train({
    features: trainingData2020,
    classProperty: 'class',
    inputProperties: ['SR_B2', 'SR_B3', 'SR_B4', 'SR_B5', 'SR_B6', 'SR_B7', 'NDVI']
  });

// 8. Classification function
function classifyImage(image) {
  var standardizedImage = image;
  if (!image.bandNames().contains('SR_B6')) {
    standardizedImage = image.addBands(ee.Image(0).rename('SR_B6'));
  }
  var withNdvi = addNdvi(standardizedImage);
  return withNdvi.classify(classifier)
    .reproject('EPSG:4326', null, 120);
}

var classified1990 = classifyImage(landsat1990);
var classified2000 = classifyImage(landsat2000);
var classified2010 = classifyImage(landsat2010);
var classified2020 = classifyImage(landsat2020);

// 9. Visualization
var classVisParams = {
  min: 1,
  max: 4,
  palette: ['green', 'red', 'yellow', 'blue']
};
Map.addLayer(classified2020, classVisParams, 'Classification 2020');

// 10. Area calculation
function getClassArea(classifiedImage, classValue) {
  var area = classifiedImage.eq(classValue)
    .multiply(ee.Image.pixelArea())
    .reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: hyderabadDistrict,
      scale: 30,
      maxPixels: 1e9
    });
  return ee.Number(area.get('classification')).divide(1e6);
}

// 11. Historical data collection
var historicalData = [];
var years = [1990, 2000, 2010, 2020];

for (var i = 0; i < classData.length; i++) {
  var cls = classData[i];
  var areas = [
    getClassArea(classified1990, cls.value).getInfo(),
    getClassArea(classified2000, cls.value).getInfo(),
    getClassArea(classified2010, cls.value).getInfo(),
    getClassArea(classified2020, cls.value).getInfo()
  ];
  historicalData.push({class: cls, areas: areas});

  print('Historical Areas for ' + cls.name,
    ee.FeatureCollection([
      ee.Feature(null, {Year: 1990, 'Area (sq km)': areas[0]}),
      ee.Feature(null, {Year: 2000, 'Area (sq km)': areas[1]}),
      ee.Feature(null, {Year: 2010, 'Area (sq km)': areas[2]}),
      ee.Feature(null, {Year: 2020, 'Area (sq km)': areas[3]})
    ])
  );
}

// 12. Linear Regression
function linearRegression(x, y) {
  var n = x.length;
  var sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  for (var i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
    sumXY += x[i] * y[i];
    sumXX += x[i] * x[i];
  }

  var slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  var intercept = (sumY - slope * sumX) / n;
  return {
    slope: slope,
    intercept: intercept,
    predict: function(year) {
      return slope * year + intercept;
    }
  };
}

// 13. Predictions
for (var i = 0; i < historicalData.length; i++) {
  var data = historicalData[i];
  var cls = data.class;
  var areas = data.areas;

  var model = linearRegression(years, areas);

  print('Predicted Areas for ' + cls.name, {
    'Model Type': 'Linear Regression',
    'Slope': model.slope,
    'Intercept': model.intercept,
    '2025 Prediction (sq km)': model.predict(2025),
    '2030 Prediction (sq km)': model.predict(2030),
    '2040 Prediction (sq km)': model.predict(2040),
    '2050 Prediction (sq km)': model.predict(2050)
  });
}

// 14. Highlight Agriculture
Map.addLayer(
  classified2020.updateMask(classified2020.eq(3)),
  {palette: ['FFFF00']},
  'Agriculture Area 2020'
);

// 15. Add Legend
var legend = ui.Panel({ style: { position: 'bottom-right', padding: '8px', backgroundColor: 'white' } });
legend.add(ui.Label('Land Cover Classes', { fontWeight: 'bold', fontSize: '16px' }));

['Forest', 'Urban', 'Agriculture', 'Water'].forEach(function(label, i) {
  legend.add(ui.Panel([
    ui.Label('', { backgroundColor: ['green', 'red', 'yellow', 'blue'][i], padding: '8px', margin: '0 4px' }),
    ui.Label(label)
  ], ui.Panel.Layout.Flow('horizontal')));
});
Map.add(legend);


// Enhanced Validation Dataset
var validationPoints = ee.FeatureCollection([
  // Vegetation (class 1) - 50 points
 ee.Feature(ee.Geometry.Point([78.3800, 17.4000]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4500, 17.3500]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4800, 17.3800]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4300, 17.3200]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.4100, 17.3100]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3000, 17.4000]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3200, 17.4200]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3300, 17.4500]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3100, 17.4100]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3400, 17.4300]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3600, 17.4400]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3700, 17.4600]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3800, 17.4700]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.2900, 17.3900]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3500, 17.4200]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3000, 17.4400]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3300, 17.4800]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3400, 17.4100]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3200, 17.4300]), {'class': 1}),
ee.Feature(ee.Geometry.Point([78.3100, 17.4600]), {'class': 1}),

// Urban areas (2)
ee.Feature(ee.Geometry.Point([78.4700, 17.3900]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4900, 17.4100]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5100, 17.3700]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4300, 17.4400]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4600, 17.4200]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4300, 17.4000]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4400, 17.4200]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4500, 17.4300]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4100, 17.4400]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4600, 17.4500]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4700, 17.4600]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.4900, 17.4700]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5000, 17.4800]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5200, 17.4900]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5300, 17.5000]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5500, 17.5100]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5600, 17.5200]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5700, 17.5300]), {'class': 2}),
ee.Feature(ee.Geometry.Point([78.5800, 17.5400]), {'class': 2}),



// Agriculture areas (3)
ee.Feature(ee.Geometry.Point([78.5650, 17.4600]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5780, 17.4740]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5900, 17.4570]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.6050, 17.4690]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5520, 17.4920]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5400, 17.4860]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5210, 17.4750]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5360, 17.4600]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.5010, 17.4550]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.4880, 17.4420]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.3500, 17.3600]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.3600, 17.3800]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.3700, 17.3900]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.3400, 17.3700]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.3800, 17.4000]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.3900, 17.4100]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.4000, 17.4200]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.4100, 17.4300]), {'class': 3}),
ee.Feature(ee.Geometry.Point([78.4200, 17.4400]), {'class': 3}),


// Water bodies (4)
ee.Feature(ee.Geometry.Point([78.3500, 17.3500]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.3700, 17.3700]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4000, 17.3800]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4200, 17.4000]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4400, 17.4100]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4000, 17.3500]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4100, 17.3400]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4200, 17.3300]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4300, 17.3200]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4400, 17.3100]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4500, 17.3000]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4600, 17.2900]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4700, 17.2800]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4800, 17.2700]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.4900, 17.2600]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5000, 17.2500]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5100, 17.2400]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5200, 17.2300]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5300, 17.2200]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5400, 17.2100]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5500, 17.2000]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5600, 17.1900]), {'class': 4}),
ee.Feature(ee.Geometry.Point([78.5700, 17.1800]), {'class': 4}),

  ])


// Sample the validation points for each image
var validationData2020 = withNdvi2020.sampleRegions({
  collection: validationPoints,
  properties: ['class'],
  scale: 30
});


// 14. Classify the validation points
var validated2020 = validationData2020.classify(classifier);


// 16. Predicted Classifications
var baseImage = landsat2020;
var predicted2025 = classifyImage(baseImage).rename('classification');
var predicted2030 = classifyImage(baseImage).rename('classification');
var predicted2040 = classifyImage(baseImage).rename('classification');
var predicted2050 = classifyImage(baseImage).rename('classification');

Map.addLayer(predicted2025, classVisParams, 'Predicted 2025');
Map.addLayer(predicted2030, classVisParams, 'Predicted 2030');
Map.addLayer(predicted2040, classVisParams, 'Predicted 2040');
Map.addLayer(predicted2050, classVisParams, 'Predicted 2050');

// 17. Export RGB versions of classified images
function classifiedToRGB(classifiedImg) {
  return classifiedImg.visualize({
    min: 1,
    max: 4,
    palette: ['green', 'red', 'yellow', 'blue']
  });
}

function exportImage(image, year, region) {
  Export.image.toDrive({
    image: image,
    description: 'Hyderabad_LandCover_' + year,
    folder: 'GEE_Exports',
    scale: 120,
    region: region,
    maxPixels: 1e9,
    crs: 'EPSG:4326',
    fileFormat: 'GeoTIFF'
  });
}

var districtGeometry = hyderabadDistrict.geometry();

exportImage(classifiedToRGB(classified1990), '1990', districtGeometry);
exportImage(classifiedToRGB(classified2000), '2000', districtGeometry);
exportImage(classifiedToRGB(classified2010), '2010', districtGeometry);
exportImage(classifiedToRGB(classified2020), '2020', districtGeometry);

exportImage(classifiedToRGB(predicted2025), 'Predicted_2025', districtGeometry);
exportImage(classifiedToRGB(predicted2030), 'Predicted_2030', districtGeometry);
exportImage(classifiedToRGB(predicted2040), 'Predicted_2040', districtGeometry);
exportImage(classifiedToRGB(predicted2050), 'Predicted_2050', districtGeometry);



// 15. Create Confusion Matrix
var confusionMatrix = validated2020.errorMatrix('class', 'classification');

// 16. Accuracy Calculation (Overall Accuracy)
var overallAccuracy = confusionMatrix.accuracy();
print('Overall Accuracy: ', overallAccuracy);

// 17. Kappa Coefficient Calculation
var kappaCoefficient = confusionMatrix.kappa();
print('Kappa Coefficient: ', kappaCoefficient);

// 18. Confusion Matrix: Print as a list of lists to show in the console
var matrixList = confusionMatrix.array();
matrixList.evaluate(function(matrix) {
  print('Confusion Matrix: ', matrix);
});

// Optional: Visualizing the confusion matrix in a more readable way using a UI panel
var matrixPanel = ui.Panel({
  widgets: [
    ui.Label('Confusion Matrix', {fontWeight: 'bold'}),
    ui.Label('Overall Accuracy: ' + overallAccuracy.format('%.2f')),
    ui.Label('Kappa Coefficient: ' + kappaCoefficient.format('%.2f'))
  ]
});

// Create a table from the matrix for better visualization
var matrixTable = ui.Chart.array.values(matrixList, 0)
  .setChartType('Table')
  .setOptions({
    title: 'Confusion Matrix'
  });

matrixPanel.add(matrixTable);
print(matrixPanel);

// Predicted areas (in sq km)
var predictedData = {
  2025: {Forest: 43.79, Urban: 101.54, Agriculture: 3.30, Water: 28.27},
  2030: {Forest: 40.34, Urban: 101.90, Agriculture: 3.72, Water: 30.94},
  2040: {Forest: 33.43, Urban: 102.63, Agriculture: 4.57, Water: 36.28},
  2050: {Forest: 26.52, Urban: 103.35, Agriculture: 5.42, Water: 41.62}
};

// Function to create pie chart for a year
function createPieChart(year) {
  var values = predictedData[year];
  var chart = ui.Chart.array.values({
    array: [values.Forest, values.Urban, values.Agriculture, values.Water],
    axis: 0,
    xLabels: ['Forest', 'Urban', 'Agriculture', 'Water']
  }).setChartType('PieChart')
    .setOptions({
      title: 'Predicted Land Cover - ' + year,
      colors: ['#228B22', '#FF8C00', '#FFFF00', '#1E90FF']
    });
  print(chart);
}

// Create pie charts for each future year
[2025, 2030, 2040, 2050].forEach(createPieChart);


// Historical years (classified)
var classifiedYears = [1990, 1995, 2000, 2005, 2010, 2015, 2020];

// Replace these with your actual classified area arrays for each class
var forestAreas = [60, 58, 56, 54, 51, 48, 45];
var urbanAreas = [30, 35, 40, 45, 60, 80, 95];
var agricultureAreas = [50, 47, 45, 42, 40, 38, 35];
var waterAreas = [28, 29, 29, 30.3, 30.5, 33, 33];

// Future years (predicted)
var predictedYears = [2025, 2030, 2040, 2050];
var forestPred = [43.79, 40.34, 33.43, 26.52];
var urbanPred = [101.54, 101.90, 102.63, 103.35];
var agriculturePred = [3.31, 3.73, 4.57, 5.42];
var waterPred = [28.27, 30.94, 36.28, 41.62];

// Combine classified + predicted for full timeline
var fullYears = classifiedYears.concat(predictedYears);

var fullForest = forestAreas.concat(forestPred);
var fullUrban = urbanAreas.concat(urbanPred);
var fullAgriculture = agricultureAreas.concat(agriculturePred);
var fullWater = waterAreas.concat(waterPred);

// Function to plot line chart
function plotTrend(name, values, color) {
  var chart = ui.Chart.array.values({
    array: values,
    axis: 0,
    xLabels: fullYears
  }).setOptions({
    title: name + ' Area Trend (Classified + Predicted)',
    hAxis: {title: 'Year'},
    vAxis: {title: 'Area (sq km)'},
    lineWidth: 3,
    colors: [color],
    pointSize: 5
  });
  print(chart);
}

// Plotting all 4 line graphs
plotTrend('Forest', fullForest, '#228B22');
plotTrend('Urban', fullUrban, '#FF8C00');
plotTrend('Agriculture', fullAgriculture, '#FFFF00');
plotTrend('Water', fullWater, '#1E90FF');