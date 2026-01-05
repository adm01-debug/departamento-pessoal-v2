export const bundleAnalyzerConfig = {
  analyzerMode: "static",
  reportFilename: "bundle-report.html",
  openAnalyzer: false,
  generateStatsFile: true,
  statsFilename: "bundle-stats.json",
  logLevel: "info",
  excludeAssets: [/\.map$/],
  budgets: [
    { type: "initial", maximumWarning: "500kb", maximumError: "1mb" },
    { type: "anyComponentStyle", maximumWarning: "6kb", maximumError: "10kb" },
    { type: "anyScript", maximumWarning: "150kb", maximumError: "300kb" },
  ],
  thresholds: { totalSize: 1048576, chunkSize: 524288, assetSize: 262144 },
};
export function analyzeBundleSize(stats: any): { passed: boolean; warnings: string[]; errors: string[] } {
  const warnings: string[] = [];
  const errors: string[] = [];
  const totalSize = stats.assets?.reduce((acc: number, a: any) => acc + a.size, 0) || 0;
  if (totalSize > bundleAnalyzerConfig.thresholds.totalSize) errors.push(`Total size ${totalSize} exceeds limit`);
  return { passed: errors.length === 0, warnings, errors };
}
export default bundleAnalyzerConfig;
