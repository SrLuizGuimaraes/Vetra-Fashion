/**
 * Formats a price in cents using the shop's own money_format string
 * (window.vetraMoneyFormat, set in layout/theme.liquid), so
 * client-side price updates (variant swaps, quick view) match the
 * server-rendered {{ | money }} output exactly instead of guessing a
 * locale.
 */
function formatWithSeparators(cents, decimals, thousands, decimalSeparator) {
  const amount = (cents / 100).toFixed(decimals);
  const [whole, fraction] = amount.split('.');
  const wholeWithThousands = whole.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
  return fraction ? `${wholeWithThousands}${decimalSeparator}${fraction}` : wholeWithThousands;
}

function formatMoney(cents, format) {
  const template = format || window.vetraMoneyFormat || '${{amount}}';
  const placeholder = /\{\{\s*(\w+)\s*\}\}/;
  const match = template.match(placeholder);
  if (!match) return template;

  let value;
  switch (match[1]) {
    case 'amount':
      value = formatWithSeparators(cents, 2, ',', '.');
      break;
    case 'amount_no_decimals':
      value = formatWithSeparators(cents, 0, ',', '.');
      break;
    case 'amount_with_comma_separator':
      value = formatWithSeparators(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithSeparators(cents, 0, '.', ',');
      break;
    case 'amount_with_space_separator':
      value = formatWithSeparators(cents, 2, ' ', ',');
      break;
    case 'amount_no_decimals_with_space_separator':
      value = formatWithSeparators(cents, 0, ' ', ',');
      break;
    default:
      value = formatWithSeparators(cents, 2, ',', '.');
  }

  return template.replace(placeholder, value);
}

window.vetraFormatMoney = formatMoney;
