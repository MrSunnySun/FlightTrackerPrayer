import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { Coordinates, PrayerTimes, DateComponents, CalculationMethod } from 'adhan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.AVIATIONSTACK_API_KEY;

const getFlightInfo = async (flightCode) => {
  const res = await axios.get('http://api.aviationstack.com/v1/flights', {
    params: {
      access_key: API_KEY,
      flight_iata: flightCode
    }
  });

  const flight = res.data.data[0];
  return {
    city: flight?.departure?.city,
    latitude: flight?.departure?.latitude,
    longitude: flight?.departure?.longitude,
    timezone: flight?.departure?.timezone
  };
};

const calculatePrayerTimes = (loc) => {
  const { latitude, longitude, timezone } = loc;

  const coords = new Coordinates(latitude, longitude);
  const params = CalculationMethod.MuslimWorldLeague();
  const now = new Date();
  const dc = DateComponents.fromDate(now);

  const times = new PrayerTimes(coords, dc, params);
  return [
    { name: 'Fajr', time: times.fajr.toLocaleTimeString('en-US', { timeZone: timezone }) },
    { name: 'Dhuhr', time: times.dhuhr.toLocaleTimeString('en-US', { timeZone: timezone }) },
    { name: 'Asr', time: times.asr.toLocaleTimeString('en-US', { timeZone: timezone }) },
    { name: 'Maghrib', time: times.maghrib.toLocaleTimeString('en-US', { timeZone: timezone }) },
    { name: 'Isha', time: times.isha.toLocaleTimeString('en-US', { timeZone: timezone }) }
  ];
};

app.post('/api/prayer-times', async (req, res) => {
  try {
    const { flightCode } = req.body;
    const loc = await getFlightInfo(flightCode);

    if (!loc.latitude || !loc.longitude) {
      return res.status(400).json({ error: 'No valid departure info for that flight.' });
    }

    const prayerTimes = calculatePrayerTimes(loc);
    res.json({ city: loc.city, timezone: loc.timezone, prayerTimes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
