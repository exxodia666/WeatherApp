import { View, Text, Dimensions, StyleSheet, ImageBackground } from "react-native";
import Weather from "../components/Weather";
import React, { useState, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { loadWeather } from "../store/actions/weather";
import { setDayTime } from "../store/actions/daytime";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import WeekForecast from "../components/WeekForecast";
import { loadForecast } from "../store/actions/forecast";
import units from "../constants/units";

const WeatherForecastScreen = (props) => {



  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, [dispatch]);

  useEffect(() => {
    if (location) {
      dispatch(geoLoadForecast(location.coords.latitude, location.coords.longitude));
      dispatch(geoLoadWeather(location.coords.latitude, location.coords.longitude));
    }
  });

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location.coords.longitude + ' ' + location.coords.latitude);
  }

 // 
  const [isFetched, setIsFetched] = useState(false);
  const settings = useSelector((state) => state.settings);
  const weather = useSelector((state) => state.weather);
  const daytime = useSelector((state) => state.daytime.time);
  const dispatch = useDispatch();
  props.navigation.setParams({cityName: weather.city})


  useEffect(() => {
    dispatch(setDayTime());
  }, []);

  const image = (daytime) ? require('../assets/day.png') : require('../assets/night.png');

  const countTemp = (settings, temperature) => {
    const temp = (settings[units.Celsius]) ? (temperature - 273.15) : (settings[units.Farenheit]) ? ((temperature - 273.15) * 1.8 + 32): temperature;
    return temp;
  }

  const fetchWeather = () => {
    dispatch(loadWeather(cityName));
    dispatch(loadForecast(cityName));
    setIsFetched(true);
  };
  useEffect(() => {
    fetchWeather();
  }, []);

  if (isFetched === false) {
    return <View style={{flex: 1, justifyContent: "center", alignItems: 'center' }}>
              <ActivityIndicator />
            </View>;
  } else {
    return (
      <ImageBackground source={image} style={styles.image}>
        <View style={styles.temperature}>
          <Weather
            icon={weather.icon}
            city={weather.city}
            temperature={ countTemp(settings.temperatureUnits, weather.temperature) }
            fetchWeather={() => fetchWeather()}
            fetchTime={weather.fetchTime}
          />
        </View>
        <WeekForecast />
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: "center"
        }}
        >
          <Text style={{ fontFamily: 'comic-neue' }}>
            Updated: {weather.fetchTime}
          </Text>
          <TouchableOpacity
            style={styles.refresh}
            onPress={() => fetchWeather()}
          >
            <Ionicons name={"md-refresh"} size={15} />
          </TouchableOpacity>
        </View>
        <Text style={{ fontFamily: 'comic-neue' }}>
          Powered by: Open Weather
          </Text>

      </ImageBackground >
    );
  }
};

const styles = StyleSheet.create({
  text:{
    fontFamily: 'comic-neue'
  },
  temperature: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refresh: {
    padding: 10,
  },
  image: {
    paddingTop: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  }
});
export default WeatherForecastScreen;
