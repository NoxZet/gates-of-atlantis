# Gates of Atlantis

WIP cRPG game.

## Running

The game server is fully self-contained, including static files server for loading from browser.

To install all necessary libraries, node 20 is required. Run:
```
npm install
```

To compile and run the server, execute
```
npm run start
```
The game will be available at `http://<ip>:3000`

After compilation, you can deploy the game with just the `public` and `server` files (in compliance with licenses as appropriate). Run the following in root to start the server:
```
node server/main_server.js
```