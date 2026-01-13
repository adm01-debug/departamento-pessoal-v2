// V20-UTIL003: Chart Helpers
export const formatChartData = (data: any[], labelKey: string, valueKey: string) => {
  return data.map(item => ({ name: item[labelKey], value: item[valueKey] }));
};

export const calculateTrend = (data: number[]) => {
  if (data.length < 2) return 0;
  const first = data[0];
  const last = data[data.length - 1];
  return ((last - first) / first) * 100;
};

export const getChartColors = (count: number) => {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F", "#FFBB28"];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};
