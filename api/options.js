// pages/api/options.js
import axios from 'axios';

export default async function handler(req, res) {
  const { expirationDate } = req.query;

  console.log('Received request for expirationDate:', expirationDate);
  console.log('FINNHUB_API_KEY is', process.env.FINNHUB_API_KEY ? 'set' : 'not set');

  try {
    const response = await axios.get('https://finnhub.io/api/v1/stock/option-chain', {
      params: {
        symbol: 'MSTR',
        token: process.env.FINNHUB_API_KEY,
      },
    });

    console.log('Received response from Finnhub.io');

    const optionsDataForDate = response.data.data[expirationDate];

    if (!optionsDataForDate || !optionsDataForDate.CALL) {
      console.warn('No options data available for the given expiration date.');
      return res.status(404).json({ message: 'No options data available for this date.' });
    }

    console.log('Sending options data back to client');
    return res.status(200).json(optionsDataForDate.CALL);
  } catch (error) {
    console.error('Error fetching options data:', error);

    if (error.response) {
      // The request was made, and the server responded with a status code outside of the 2xx range
      console.error('Error response from Finnhub.io:', error.response.data);
      return res.status(error.response.status).json({ message: error.response.data.error });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from Finnhub.io:', error.request);
      return res.status(500).json({ message: 'No response received from Finnhub.io' });
    } else {
      // Something else happened while setting up the request
      console.error('Error setting up the request:', error.message);
      return res.status(500).json({ message: 'Error setting up the request' });
    }
  }
}
