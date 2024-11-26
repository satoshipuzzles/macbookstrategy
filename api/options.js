// pages/api/options.js
import axios from 'axios';

export default async function handler(req, res) {
  const { expirationDate } = req.query;

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

    const optionsDataForDate = response.data.data[expirationDate];
    if (!optionsDataForDate || !optionsDataForDate.CALL) {
      res
        .status(404)
        .json({ message: 'No options data available for this date.' });
      return;
    }

    res.status(200).json(optionsDataForDate.CALL);
  } catch (error) {
    console.error('Error fetching options data:', error);

    if (error.response) {
      // The request was made, and the server responded with a status code outside of 2xx
      console.error('Response data:', error.response.data);
      console.error('Status code:', error.response.status);
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error('No response received:', error.request);
      res.status(500).json({ message: 'No response received from Finnhub.io' });
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
      res.status(500).json({ message: 'Error in API request setup' });
    }
  }
}
