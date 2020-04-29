import Axios from "axios";
import { Alert } from "react-native";
import { geoForecastReqUrl, cityForecastReqUrl } from "../../constants/constants";
const moment = require('moment');

export const LOAD_FORECAST = "LOAD_FORECAST";

const key = "44c682133431d2307217999c8c120d54";

export function geoLoadForecast(lat, lon) {
  return (dispatch) => {
    return Axios.get(geoForecastReqUrl(lat, lon))
      .then((response) => {
        dispatch({ type: LOAD_FORECAST, data: response.data, time: moment().format('MMMM Do YYYY, h:mm:ss a') });
      })
      .catch((error) => {
        Alert.alert('Error' + error);
        //todo dispatch error
      });
  };
}

export function loadForecast(city) {
  return (dispatch) => {
    return Axios.get(cityForecastReqUrl(city))
      .then((response) => {
        dispatch({ type: LOAD_FORECAST, data: response.data, time: moment().format('MMMM Do YYYY, h:mm:ss a') });
      })
      .catch((error) => {
        Alert.alert('Error' + error);
        //todo dispatch error
      });
  };
}