# apex-tracker
a tool for creating apex tracker widgets on OBS/Streamlabs

requires node 10 (https://nodejs.org/en/download/)

1) get an API key here: https://apex.tracker.gg/site-api
2) add that to a config.json file (see example)
3) set the user and platform to track in the config
4) from command line: `npm install`
5) from command line: `npm start`
6) visit `http://localhost:3000` or set it as a browser source in OBS/Streamlabs

Possible `Platform` values (case insensitive):
 - xbox
 - playstation
 - psn
 - pc
 - origin

Example: `http://localhost/?platform=PC&profile=bbqsamich,webwookie`

