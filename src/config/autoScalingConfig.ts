// V20-DEVOPS002: Auto-Scaling Config
export const autoScalingConfig = {
  minInstances: 2,
  maxInstances: 10,
  targetCPU: 70,
  targetMemory: 80,
  scaleUpCooldown: 180,
  scaleDownCooldown: 300,
  metrics: {
    cpu: { threshold: 70, weight: 0.5 },
    memory: { threshold: 80, weight: 0.3 },
    requests: { threshold: 1000, weight: 0.2 }
  },
  schedules: [
    { name: "business-hours", cron: "0 8 * * 1-5", minInstances: 4 },
    { name: "off-hours", cron: "0 20 * * 1-5", minInstances: 2 }
  ]
};

export const shouldScaleUp = (currentLoad: number) => {
  return currentLoad > autoScalingConfig.targetCPU;
};
