# apex-tracker
a tool for creating apex tracker widgets on OBS/Streamlabs

requires node 10 (https://nodejs.org/en/download/)

1) get an API key here: https://apex.tracker.gg/site-api
2) add that to a config.json file (see example)
3) optionally set the user and platform to not need to set it in the URI
4) from command line: `npm install`
5) from command line: `npm start`
6) visit `http://localhost:3000` or set it as a browser source in OBS/Streamlabs

If you want to watch a different profile than the one set in the config visit:

```txt
	http://localhost/?platform=<plaform>&profile=<profileName>[,<profileName>,<profileName>]
```
	
Example: `http://localhost/?platform=PC&profile=bbqsamich,webwookie`
