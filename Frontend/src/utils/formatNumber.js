import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00');
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
    if (!number) {
      return '--';
    }
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return numeral(number).format('0.0a').replace('0.0', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}

export function fNumberVND(number) {
  if (number >= 10000000) {
    return `${(number / 1000000).toFixed(0)}tr`;
  }
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(0)}tr`;
  }
  if (number >= 100000) {
    return `${(number / 1000).toFixed(0)}k`;
  }
  if (number >= 10000) {
    return `${(number / 1000).toFixed(0)}k`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(0)}k`;
  }
  return number;
}


export function formatPriceInVND(price) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(price);
}