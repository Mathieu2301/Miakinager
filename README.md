# Miakinager
 UI for server running with PM2
 
## Installation

1. `pm2 install miakinager` 
2. Go to [localhost](http://localhost)
3. Login with default password : `password`
4. Done !

## Configuration

 The current configuration file is located in the `.pm2\modules` directory. 
 `%userprofile%\.pm2\modules\miakinager\node_modules\miakinager\_miakonfig.json`
 
 Currently, you can :
 - Modify the password for UI access
 - Switch between normal or SSL Mode (80/443 port)
 - Modify SSL Certificates path
 - Modify the directory where Miakinager is automatically looking for all directories where a `package.json` file is.
 
## Launch
 
 There are two different repositories.
 First, at the root, is the server (NodeJS/Express).
 Second, at `client/`, is the client (Vue3/VueRouter/Webpack/Babel).
 
 1. Install dependencies for the two repositories `npm i && cd client/ && npm 1`

### Developement
 
 1. Run server `npm run dev`, it will only be used to access to the API
 2. Run Vue DevServer `cd client/ && npm run serve` to have the website and hotrefresh
 3. Go to the devserver : `http://localhost:8080/`
 
 You can also use `vue ui` command.
 
### Build

 1. Build client `cd client/ && npm run build`
 2. The dist files should be located in the `/web` directory
 3. Just run `npm start` and go to [http://localhost](localhost)
 or [https://localhost](https://localhost) if you are in SSL mode.

## Problems

 If you have errors in console or unwanted behavior, just reload the page.
 If the problem persists, please create an issue.
