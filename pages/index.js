import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import OptionsTable from '../components/OptionsTable';
import Chart from '../components/Chart';
import GreeksInfo from '../components/GreeksInfo';
import styled, { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    background: '#121212',
    text: '#ffffff',
    primary: '#bb86fc',
    secondary: '#03dac6',
  },
};

const Container = styled.div`
  padding: 20px;
  min-height: 100vh;
`;

export default function Home() {
  const [stockPrice, setStockPrice] = useState(600);
  const [expirationDate, setExpirationDate] = useState('2024-12-20');
  const [optionsData, setOptionsData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetchOptionsData();
  }, [expirationDate]);

  const fetchOptionsData = async () => {
    try {
      const response = await axios.get(
        `https://api.polygon.io/v3/snapshot/options/MSTR?expiration_date=${expirationDate}&contract_type=call&limit=1000&apiKey=${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`
      );
      setOptionsData(response.data.results || []);
    } catch (error) {
      console.error('Error fetching options data:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}
