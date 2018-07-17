const Web3 = require('web3');
import { config } from '../config/env';

const provider = new Web3.providers.HttpProvider(config.ethNode);
const web3 = new Web3(provider);
export default web3;