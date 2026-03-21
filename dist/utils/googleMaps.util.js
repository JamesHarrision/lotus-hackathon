"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoordinatesFromAddress = void 0;
const axios_1 = __importDefault(require("axios"));
const getCoordinatesFromAddress = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_MAPS_API_KEY is not defined in .env');
    }
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
    try {
        const response = await axios_1.default.get(url);
        const data = response.data;
        if (data.status === 'OK' && data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            const formattedAddress = data.results[0].formatted_address;
            return { lat, lng, formattedAddress };
        }
        else {
            throw new Error(`Geocoding failed for address: ${address}. Status: ${data.status}`);
        }
    }
    catch (error) {
        throw new Error(`Error calling Google Maps Geocoding API: ${error.message}`);
    }
};
exports.getCoordinatesFromAddress = getCoordinatesFromAddress;
