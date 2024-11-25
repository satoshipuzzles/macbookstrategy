import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #ffffff;
`;

const Th = styled.th`
  border: 1px solid #333;
  padding: 8px;
  background-color: #1e1e1e;
`;

const Td = styled.td`
  border: 1px solid #333;
  padding: 8px;
  text-align: center;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #333;
    cursor: pointer;
  }
`;

export default function OptionsTable({ optionsData, setSelectedOption }) {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>Strike Price</Th>
            <Th>Last Price</Th>
            <Th>Change</Th>
            <Th>Volume</Th>
            <Th>Open Interest</Th>
          </tr>
        </thead>
        <tbody>
          {optionsData.map((option) => (
            <Tr
              key={option.details.ticker}
              onClick={() => setSelectedOption(option)}
            >
              <Td>{option.details.strike_price}</Td>
              <Td>
                {option.last_trade
                  ? option.last_trade.price.toFixed(2)
                  : 'N/A'}
              </Td>
              <Td>
                {option.day ? option.day.change.toFixed(2) : 'N/A'}
              </Td>
              <Td>{option.day ? option.day.volume : 'N/A'}</Td>
              <Td>{option.open_interest || 'N/A'}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}
