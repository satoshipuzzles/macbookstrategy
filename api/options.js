import axios from 'axios';

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing stock symbol' });
  }

  try {
    const response = await axios.get(`https://query2.finance.yahoo.com/v7/finance/options/${symbol}`);
    if (response.data && response.data.optionChain && response.data.optionChain.result) {
      res.status(200).json(response.data);
    } else {
      console.error('Invalid response structure:', response.data);
      res.status(500).json({ error: 'Invalid API response from Yahoo Finance' });
    }
  } catch (error) {
    console.error('Error fetching Yahoo Finance data:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to fetch options data from Yahoo Finance' });
  }
}
