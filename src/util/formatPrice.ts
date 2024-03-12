const formatPrice = (price: number) => {
  const isNegative = price < 0;
  return `$${Math.abs(price * 0.001).toFixed(2)} ${isNegative ? 'outflow' : 'inflow'}`;
};

export default formatPrice;
