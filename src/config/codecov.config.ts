export const codecovConfig = {
  coverage: {
    status: {
      project: { default: { target: "auto", threshold: "1%", informational: false } },
      patch: { default: { target: "80%", threshold: "1%" } },
    },
    range: "70...100",
    precision: 2,
    round: "down",
  },
  parsers: { gcov: { branch_detection: { conditional: "yes", loop: "yes", method: "no", macro: "no" } } },
  comment: { layout: "reach,diff,flags,files", behavior: "default", require_changes: true, require_base: false, require_head: true },
  flags: {
    unittests: { paths: ["src/"], carryforward: true },
    integration: { paths: ["tests/integration/"], carryforward: false },
  },
  ignore: ["**/*.test.ts", "**/*.spec.ts", "**/*.stories.tsx", "**/mocks/**", "**/test-utils/**"],
};
export default codecovConfig;
