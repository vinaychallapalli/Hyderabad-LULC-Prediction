# Hyderabad-LULC-Prediction

# 🌍 Land Cover Change Analysis & Prediction – Hyderabad (1990–2050)

This project leverages **Google Earth Engine (GEE)** to analyze and forecast **land use and land cover (LULC)** changes in **Hyderabad District**, India, using **Landsat satellite imagery**. It classifies 30+ years of data and predicts trends up to **2050** using **machine learning models**.

---

## 📌 Objective

- Monitor land cover changes in Hyderabad (1990–2020)
- Classify land types: Forest, Urban, Agriculture, and Water
- Predict future land use (2025–2050)
- Assist planners with data-driven urban insights

---

## 🛠️ Tools & Technologies

| Component              | Details                                  |
|------------------------|------------------------------------------|
| Data Source            | Landsat 5, 7, 8                          |
| Platform               | Google Earth Engine (JavaScript API)     |
| Classifier             | Random Forest                            |
| Prediction Algorithm   | Linear Regression                        |
| Evaluation Metrics     | Overall Accuracy, Kappa Coefficient      |
| Visualization          | UI Charts (Pie, Line), GeoTIFF exports   |

---

## 🧠 Methodology

### 1. 📍 Area of Interest
- Hyderabad District (ADM2 level)
- Fetched using FAO/GAUL dataset

### 2. ☁️ Preprocessing
- Landsat cloud and shadow masking
- Band standardization across sensors
- NDVI band added

### 3. 🏷️ Classification
- 4 LULC classes:  
  - 🌲 Forest (1)  
  - 🏙️ Urban (2)  
  - 🌾 Agriculture (3)  
  - 💧 Water (4)
- Used 100+ manually labeled training points
- Random Forest (100 trees) for classification

### 4. 📈 Prediction
- Calculated historical area using pixelArea()
- Built regression models per class (year vs area)
- Predicted values for: **2025, 2030, 2040, 2050**

### 5. 📏 Evaluation
- **Overall Accuracy**: `93.75%`  
- **Kappa Coefficient**: `0.91`  
- Validated using a separate set of ground truth points

---

## 📊 Results

### 🔢 Predicted Land Use Areas (in sq. km)

| Year | Forest | Urban | Agriculture | Water |
|------|--------|-------|-------------|-------|
| 2025 | 43.79  | 101.54| 3.31        | 28.27 |
| 2030 | 40.34  | 101.90| 3.73        | 30.94 |
| 2040 | 33.43  | 102.63| 4.57        | 36.28 |
| 2050 | 26.52  | 103.35| 5.42        | 41.62 |

📁 Visual outputs: `/charts/` ,'/outputs 
' folder  
📎 Classified maps: Exported as **GeoTIFFs** for 1990–2050

---

## 🖼️ Visualizations

- ✅ **Pie Charts**: Proportions of land cover (2025, 2030, 2040, 2050)
- 📉 **Line Charts**: Temporal trends across classes (1990–2050)
- 🗺️ **Map Layers**: Classified images displayed in GEE

---


