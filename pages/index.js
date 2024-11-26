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
  const [stockPrice, setStockPrice] = useState(403.45); // Default to MSTR's price
  const [expirationDate, setExpirationDate] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [optionsData, setOptionsData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetchExpirationDates();
  }, []);

  useEffect(() => {
    if (expirationDate) {
      fetchOptionsData();
    }
  }, [expirationDate]);

  const fetchExpirationDates = async () => {
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/stock/option_chain`,
        {
          params: {
            symbol: 'MSTR',
            token: process.env.NEXT_PUBLIC_FINNHUB_API_KEY,
          },
        }
      );

      const dates = Object.keys(response.data.data);
      setAvailableDates(dates);

      // Set the first available expiration date if none is selected
      if (!expirationDate && dates.length > 0) {
        setExpirationDate(dates[0]);
      }
    } catch (error) {
      console.error('Error fetching expiration dates:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };

  const fetchOptionsData = async () => {
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/stock/option_chain`,
        {
          params: {
            symbol: 'MSTR',
            token: process.env.NEXT_PUBLIC_FINNHUB_API_KEY,
          },
        }
      );

      const optionsDataForDate = response.data.data[expirationDate];
      if (!optionsDataForDate || !optionsDataForDate.CALL) {
        console.warn('No options data available for this date.');
        setOptionsData([]);
        return;
      }

      const options = optionsDataForDate.CALL;

      // Map data to match your application's requirements
      const mappedOptions = options.map((option) => ({
        details: {
          ticker: option.symbol,
          strike_price: option.strike,
        },
        last_trade: {
          price: option.lastPrice || option.bid || option.ask || 0,
        },
        day: {
          change: option.change || 0,
          volume: option.volume || 0,
        },
        open_interest: option.openInterest || 0,
        greeks: {
          delta: option.delta || 0,
          gamma: option.gamma || 0,
          theta: option.theta || 0,
          vega: option.vega || 0,
        },
        implied_volatility: option.impliedVolatility || 0,
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
        availableDates={availableDates}
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
