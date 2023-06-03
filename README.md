# RoadAnalyzer
Project for analyzing road qualities using:
<h2> Website: </h2> 
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>Javascript</li>
    <li>Leaflet.js library</li>
</ul>

<h2> Mobile app: </h2> 
<ul>
    <li>Platform: Expo (React Native)</li>
    <li>Language: Javascript</li>
</ul>

<h2> Backend/server: </h2> 
<ul>
    <li>Platform: Flask</li>
    <li>Language: python</li>
</ul>

using expo as a platform for mobile app and flask as the backend for the website and the mobile app.

# Requirements

You will need to have these installed:
- Expo
- Flask
- NodeJs
- MongoDB
- and the provided dependencies

# Installation

Install from source
```bash
git clone https://github.com/PametniPaketnik/razvoj-aplikacij-za-internet
cd RoadAnalyzer
npm install client/RoadAnalyzerApp/
cd server
pip install \-r "requirements.txt"

```

Once everything is setup, you must configure database connection inside server/app.py (Line 19):
'host': <Your database connection>

# Run

Launch backend and website with (Starting from root folder "Road-Analyzer"):
```bash
cd server
python app.py
```

Launch frontend with (Starting from the root foler like before):
```bash
cd client/RoadAnalyzerApp/
npx expo start
```