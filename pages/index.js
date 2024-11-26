// pages/index.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import OptionsTable from '../components/OptionsTable';
import Chart from '../components/Chart';
import GreeksInfo from '../components/GreeksInfo';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  min-height: 100vh;
`;

export default function Home() {
  const [stockPrice, setStockPrice] = useState(600);
  const [expirationDate, setExpirationDate] = useState('2023-12-15');
  const [optionsData, setOptionsData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetchOptionsData();
  }, [expirationDate]);

  const fetchOptionsData = async () => {
    try {
      // Fetch options chain data from Finnhub.io
      const response = await axios.get(
        `https://finnhub.io/api/v1/stock/option-chain`,
        {
          params: {
            symbol: 'MSTR',
            date: expirationDate,
            token: process.env.NEXT_PUBLIC_FINNHUB_API_KEY,
          },
        }
      );

      // Extract call options
      const options = response.data.calls || [];

      // Map data to match your application's requirements
      const mappedOptions = options.map((option) => ({
        details: {
          ticker: option.symbol,
          strike_price: option.strike,
        },
        last_trade: {
          price: option.lastPrice,
        },
        day: {
          change: option.change,
          volume: option.volume,
        },
        open_interest: option.openInterest,
        greeks: {
          delta: option.delta,
          gamma: option.gamma,
          theta: option.theta,
          vega: option.vega,
        },
        implied_volatility: option.impliedVolatility,
      }));

      setOptionsData(mappedOptions);
    } catch (error) {
      console.error('Error fetching options data:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };

  return (
    <Container>
      <Header
        stockPrice={stockPrice}
        setStockPrice={setStockPrice}
        expirationDate={expirationDate}
        setExpirationDate={setExpirationDate}
      />
      <OptionsTable
        optionsData={optionsData}
        setSelectedOption={setSelectedOption}
      />
      {selectedOption && (
        <>
          <Chart option={selectedOption} stockPrice={stockPrice} />
          <GreeksInfo option={selectedOption} />
        </>
      )}
    </Container>
  );
}
