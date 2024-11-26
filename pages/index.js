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
  const [stockPrice, setStockPrice] = useState(403.45); // Set default to lastTradePrice
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
        `https://eodhistoricaldata.com/api/options/MSTR.US`, // Note the '.US' suffix
        {
          params: {
            api_token: process.env.NEXT_PUBLIC_EOD_API_KEY,
            fmt: 'json',
          },
        }
      );

      const allData = response.data.data || [];
      const dates = allData.map((item) => item.expirationDate);

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
        `https://eodhistoricaldata.com/api/options/MSTR.US`, // Note the '.US' suffix
        {
          params: {
            api_token: process.env.NEXT_PUBLIC_EOD_API_KEY,
            fmt: 'json',
          },
        }
      );

      const allData = response.data.data || [];
      // Find the data for the selected expiration date
      const expirationData = allData.find(
        (item) => item.expirationDate === expirationDate
      );

      if (
        !expirationData ||
        !expirationData.options ||
        !expirationData.options.CALL
      ) {
        console.warn('No options data available for this date.');
        setOptionsData([]);
        return;
      }

      const options = expirationData.options.CALL;

      // Map data to match your application's requirements
      const mappedOptions = options.map((option) => ({
        details: {
          ticker: option.contractName,
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
