export const sonarConfig = {
  projectKey: "departamento-pessoal",
  projectName: "Departamento Pessoal",
  projectVersion: "1.0.0",
  sources: "src",
  tests: "src",
  testInclusions: "**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx",
  exclusions: "**/node_modules/**,**/dist/**,**/coverage/**,**/*.stories.tsx",
  typescript: { lcovReportPaths: "coverage/lcov.info" },
  javascript: { lcovReportPaths: "coverage/lcov.info" },
  coverage: { exclusions: "**/*.stories.tsx,**/*.test.ts,**/*.spec.ts,**/mocks/**" },
  qualitygate: {
    conditions: [
      { metric: "new_coverage", op: "LT", error: "80" },
      { metric: "new_duplicated_lines_density", op: "GT", error: "3" },
      { metric: "new_maintainability_rating", op: "GT", error: "1" },
      { metric: "new_reliability_rating", op: "GT", error: "1" },
      { metric: "new_security_rating", op: "GT", error: "1" },
    ],
  },
};
export default sonarConfig;
