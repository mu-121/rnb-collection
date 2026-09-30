const PKR_FORMATTER = new Intl.NumberFormat("en-PK", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPKR(value: number) {
  return `Rs. ${PKR_FORMATTER.format(value)}`;
}
