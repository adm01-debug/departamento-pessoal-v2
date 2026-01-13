// V20-DEVOPS001: Blue-Green Deployment Config
export const blueGreenConfig = {
  blue: {
    name: "blue",
    port: 3000,
    healthCheck: "/api/health",
    weight: 100
  },
  green: {
    name: "green",
    port: 3001,
    healthCheck: "/api/health",
    weight: 0
  },
  switchover: {
    gradual: true,
    steps: [10, 25, 50, 75, 100],
    intervalMs: 60000,
    rollbackOnError: true
  },
  healthCheck: {
    intervalMs: 5000,
    timeout: 3000,
    unhealthyThreshold: 3
  }
};

export const getCurrentEnvironment = () => {
  return blueGreenConfig.blue.weight > 0 ? "blue" : "green";
};
