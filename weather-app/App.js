import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import axios from 'axios';

const WMO_CODES = {
  0: { label: 'Clear Sky', icon: '☀️' },
  1: { label: 'Mainly Clear', icon: '🌤️' },
  2: { label: 'Partly Cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Fog', icon: '🌫️' },
  48: { label: 'Depositing Rime Fog', icon: '🌫️' },
  51: { label: 'Light Drizzle', icon: '🌧️' },
  53: { label: 'Moderate Drizzle', icon: '🌧️' },
  55: { label: 'Dense Drizzle', icon: '🌧️' },
  56: { label: 'Light Freezing Drizzle', icon: '🌧️' },
  57: { label: 'Dense Freezing Drizzle', icon: '🌧️' },
  61: { label: 'Slight Rain', icon: '🌧️' },
  63: { label: 'Moderate Rain', icon: '🌧️' },
  65: { label: 'Heavy Rain', icon: '🌧️' },
  66: { label: 'Light Freezing Rain', icon: '🌧️' },
  67: { label: 'Heavy Freezing Rain', icon: '🌧️' },
  71: { label: 'Slight Snow Fall', icon: '❄️' },
  73: { label: 'Moderate Snow Fall', icon: '❄️' },
  75: { label: 'Heavy Snow Fall', icon: '❄️' },
  77: { label: 'Snow Grains', icon: '❄️' },
  80: { label: 'Slight Rain Showers', icon: '🌦️' },
  81: { label: 'Moderate Rain Showers', icon: '🌦️' },
  82: { label: 'Violent Rain Showers', icon: '🌦️' },
  85: { label: 'Slight Snow Showers', icon: '🌨️' },
  86: { label: 'Heavy Snow Showers', icon: '🌨️' },
  95: { label: 'Thunderstorm', icon: '⛈️' },
  96: { label: 'Thunderstorm with Light Hail', icon: '⛈️' },
  99: { label: 'Thunderstorm with Heavy Hail', icon: '⛈️' },
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);

        // Fetch weather data from Open-Meteo
        const { latitude, longitude } = loc.coords;
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        
        setWeather(response.data.current_weather);
      } catch (err) {
        setErrorMsg('Failed to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Fetching Weather...</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{errorMsg}</Text>
        <StatusBar style="light" />
      </View>
    );
  }

  const weatherInfo = weather ? (WMO_CODES[weather.weathercode] || { label: 'Unknown', icon: '❓' }) : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.weatherContainer}>
        {weather && weatherInfo && (
          <>
            <Text style={styles.icon}>{weatherInfo.icon}</Text>
            <Text style={styles.temperature}>{Math.round(weather.temperature)}°C</Text>
            <Text style={styles.condition}>{weatherInfo.label}</Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>Wind: {weather.windspeed} km/h</Text>
            </View>
          </>
        )}
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 100,
    marginBottom: 20,
  },
  temperature: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  condition: {
    fontSize: 28,
    color: '#94A3B8',
    marginBottom: 40,
    textTransform: 'capitalize',
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 18,
    color: '#E2E8F0',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#ffffff',
  },
  errorText: {
    fontSize: 18,
    color: '#F87171',
    textAlign: 'center',
    padding: 20,
  },
});
