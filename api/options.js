// pages/api/options.js
import axios from 'axios';

export default async function handler(req, res) {
  const { expirationDate } = req.query;

  console.log('Received expirationDate:', expirationDate);
  console.log('FINNHUB_API_KEY:', process.env.FINNHUB_API_KEY ? 'Available' : 'Not available');

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

    console.log('Response from Finnhub.io received');

    const optionsDataForDate = response.data.data[expirationDate];

    if (!optionsDataForDate || !optionsDataForDate.CALL) {
      console.warn('No options data available for this date.');
      res
        .status(404)
        .json({ message: 'No options data available for this date.' });
      return;
    }

    res.status(200).json(optionsDataForDate.CALL);
  } catch (error) {
    console.error('Error fetching options data:', error);

    if (error.response) {
      console.error('Error response from Finnhub.io:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error('No response received from Finnhub.io:', error.request);
      res.status(500).json({ message: 'No response received from Finnhub.io' });
    } else {
      console.error('Error in setting up the API request:', error.message);
      res.status(500).json({ message: 'Error in API request setup' });
    }
  }
}
