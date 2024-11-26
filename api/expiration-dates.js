// pages/api/expiration-dates.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/option-chain`,
      {
        params: {
          symbol: 'MSTR',
          token: process.env.FINNHUB_API_KEY,
        },
      }
    );

    const dates = Object.keys(response.data.data);
    res.status(200).json(dates);
  } catch (error) {
    console.error('Error fetching expiration dates:', error);
    res.status(500).json({ message: 'Failed to fetch expiration dates' });
  }
}
