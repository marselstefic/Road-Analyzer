# RoadAnalyzer

Project for analyzing road qualities using:

<h2> Website: </h2> 
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>Javascript</li>
    <li>Leaflet.js library</li>
</ul>

<h2> Client sides (you can choose one or the other): </h2>

<h3> Mobile app: </h3> 
<ul>
    <li>Platform: Expo (React Native)</li>
    <li>Language: Javascript</li>
</ul>
<br>

<h3> Or... </h3>
<br>

<h3> Board apps: </h3>

<i> TODO: sensor data does NOT YET send files to database! </i>

<h4> Sensor board: </h4> 
<ul>
    <li>Platform: STM32 </li>
    <li>Language: C </li>
</ul>

<h4> Wifi board (For receiving sensor data without connecting board data via USB): </h4> 
<ul>
    <li>Platform: Arduino </li>
</ul>

<h2> Backend/server: </h2> 
<ul>
    <li>Platform: Flask</li>
    <li>Language: python</li>
</ul>

# Requirements

You will need to have these installed:

- Expo
- Flask
- NodeJs
- MongoDB
- and the provided dependencies

Additionaly, if you're going to use microcontrollers:

- Stm32CubeIde
- Arduino

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
'host': (Your database connection)

# Run

Launch backend and website with (Starting from root folder "Road-Analyzer"):

```bash
cd server
python app.py
```

Launch client side with mobile app (Starting from the root foler like before)...:

```bash
cd client/RoadAnalyzerApp/
npx expo start
```

Or with microcontrollers:

Launch project files in the client_micro_controller folder (stm32 project file and arduino).
