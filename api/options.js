import axios from 'axios';

export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing stock symbol' });
  }

  try {
    const response = await axios.get(`https://query2.finance.yahoo.com/v7/finance/options/${symbol}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching Yahoo Finance data:', error);
    res.status(500).json({ error: 'Failed to fetch options data' });
  }
}
