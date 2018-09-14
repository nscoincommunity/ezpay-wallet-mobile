/** @format */

import { AppRegistry } from 'react-native';
import Setup from './App';
import { name as appName } from './app.json';
import './global';
import './shim.js';
import crypto from 'crypto'

AppRegistry.registerComponent(appName, () => Setup);
