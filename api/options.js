// pages/api/options.js
import axios from 'axios';

export default async function handler(req, res) {
  const { expirationDate } = req.query;

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/option_chain`,
      {
        params: {
          symbol: 'MSTR',
          token: process.env.FINNHUB_API_KEY, // Note: No NEXT_PUBLIC_
        },
      }
    );

    const optionsDataForDate = response.data.data[expirationDate];
    if (!optionsDataForDate || !optionsDataForDate.CALL) {
      res.status(404).json({ message: 'No options data available for this date.' });
      return;
    }

    res.status(200).json(optionsDataForDate.CALL);
  } catch (error) {
    console.error('Error fetching options data:', error);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
