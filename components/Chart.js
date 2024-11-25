import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
`;

export default function Chart({ option, stockPrice }) {
  const data = [];

  const optionPrice = option.last_trade
    ? option.last_trade.price
    : option.greeks
    ? option.greeks.delta * stockPrice
    : 0;

  for (
    let price = stockPrice * 0.5;
    price <= stockPrice * 1.5;
    price += stockPrice * 0.05
  ) {
    const intrinsicValue = Math.max(price - option.details.strike_price, 0);
    const profit = intrinsicValue - optionPrice;
    data.push({ price: price.toFixed(2), profit: profit.toFixed(2) });
  }

  return (
    <ChartContainer>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="price" />
          <YAxis />
          <Tooltip />
          <ReferenceLine x={stockPrice} stroke="red" label="Current Price" />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#bb86fc"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
