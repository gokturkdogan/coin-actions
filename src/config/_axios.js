import axios from 'axios';
const BASE_API_URL= "https://api.binance.com/";

const Services = axios.create({baseURL: String(BASE_API_URL)});
 
export default Services;