// components/GreeksInfo.js
import React from 'react';
import styled from 'styled-components';

const GreeksContainer = styled.div`
  margin-bottom: 20px;
`;

const GreeksList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const GreekItem = styled.li`
  margin-bottom: 5px;
`;

export default function GreeksInfo({ option }) {
  const { greeks } = option;
  return (
    <GreeksContainer>
      <h2>Option Greeks</h2>
      {greeks ? (
        <GreeksList>
          <GreekItem>Delta: {greeks.delta.toFixed(4)}</GreekItem>
          <GreekItem>Gamma: {greeks.gamma.toFixed(4)}</GreekItem>
          <GreekItem>Theta: {greeks.theta.toFixed(4)}</GreekItem>
          <GreekItem>Vega: {greeks.vega.toFixed(4)}</GreekItem>
          <GreekItem>
            Implied Volatility: {(option.implied_volatility).toFixed(2)}%
          </GreekItem>
        </GreeksList>
      ) : (
        <p>Greeks data not available.</p>
      )}
    </GreeksContainer>
  );
}
