export const renovateConfig = {
  extends: ["config:base", ":preserveSemverRanges"],
  timezone: "America/Sao_Paulo",
  schedule: ["after 10pm and before 5am every weekday", "every weekend"],
  labels: ["dependencies", "automated"],
  automerge: true,
  automergeType: "pr",
  platformAutomerge: true,
  prConcurrentLimit: 5,
  prHourlyLimit: 2,
  packageRules: [
    { matchUpdateTypes: ["minor", "patch"], automerge: true },
    { matchUpdateTypes: ["major"], automerge: false, labels: ["dependencies", "major"] },
    { matchPackagePatterns: ["^@types/"], automerge: true, groupName: "TypeScript types" },
    { matchPackagePatterns: ["eslint", "prettier"], groupName: "Linting tools" },
    { matchPackagePatterns: ["vitest", "testing-library"], groupName: "Testing tools" },
    { matchPackagePatterns: ["react", "react-dom"], groupName: "React" },
  ],
  vulnerabilityAlerts: { labels: ["security"], automerge: true },
};
export default renovateConfig;
