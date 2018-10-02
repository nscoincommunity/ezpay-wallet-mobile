# WALLET USING WEB3 AND KEYTHEREUM
 
 Project for create wallet application in android and ios
 
 ## Getting start
 
 These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

Learn once, write anywhere: Build mobile apps with React.

See the official [React Native website](https://facebook.github.io/react-native/) for an introduction to React Native.

- [Requirements](#requirements)
- [Getting Started](https://github.com/facebook/react-native#building-your-first-react-native-app)
- [Documentation](https://github.com/facebook/react-native#full-documentation)
- [Upgrading](https://facebook.github.io/react-native/docs/upgrading)
- [Contributing](#contributing)
- [License](#license)

---

## Requirements

Supported target operating systems are >= Android 4.1 (API 16) and >= iOS 9.0. You may use Windows, macOS, or Linux as your development operating system, though building and running iOS apps is limited to macOS by default (tools like [Expo](https://expo.io) can be used to get around this).
## Install project

Go to package.json delete row
```
    "react-native-http": "tradle/react-native-http#834492d",
```
and delete file package-lock.json, shim.js and install node module
```
    npm install
```
After node module has been install success then shim:

 ```sh
  npm i --save-dev mvayngrib/rn-nodeify
  # install node core shims and recursively hack package.json files
  # in ./node_modules to add/update the "browser"/"react-native" field with relevant mappings
  ./node_modules/.bin/rn-nodeify --hack --install
  ```
  ## Deploy
  
  start server react:
  ```sh
  npm start
  # or
  react-native start
  ```
  run app in device or simulator
  ```sh
  - react-native run-ios # for ios
  - react-native run-android # for android
  ```
  ## Contributing
  * Facebook: https://www.facebook.com/huu.tho.92754
  ## License
  
