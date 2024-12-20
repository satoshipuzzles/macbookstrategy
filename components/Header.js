// components/Header.js
import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.colors.primary};
`;

const InputGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  margin-right: 10px;
`;

const Input = styled.input`
  background-color: #1e1e1e;
  border: none;
  color: #ffffff;
  padding: 5px;
  border-radius: 4px;
`;

const Select = styled.select`
  background-color: #1e1e1e;
  border: none;
  color: #ffffff;
  padding: 5px;
  border-radius: 4px;
`;

export default function Header({
  stockPrice,
  setStockPrice,
  expirationDate,
  setExpirationDate,
  availableDates,
}) {
  return (
    <HeaderContainer>
      <Title>Macbook Strategy</Title>
      <InputGroup>
        <Label>Stock Price:</Label>
        <Input
          type="number"
          value={stockPrice}
          onChange={(e) => setStockPrice(Number(e.target.value))}
        />
      </InputGroup>
      <InputGroup>
        <Label>Expiration Date:</Label>
        <Select
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        >
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </Select>
      </InputGroup>
    </HeaderContainer>
  );
}
