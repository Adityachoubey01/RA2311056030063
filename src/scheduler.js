function scheduleTasks(tasks, capacity) {
  const n = tasks.length;

  const dp = Array.from({ length: n + 1 }, () =>
    Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const duration = tasks[i - 1].Duration;
    const impact = tasks[i - 1].Impact;

    for (let time = 0; time <= capacity; time++) {
      dp[i][time] = dp[i - 1][time];

      if (duration <= time) {
        const includeImpact = impact + dp[i - 1][time - duration];
        dp[i][time] = Math.max(dp[i][time], includeImpact);
      }
    }
  }

  let selectedTasks = [];
  let remainingTime = capacity;

  for (let i = n; i > 0; i--) {
    if (dp[i][remainingTime] !== dp[i - 1][remainingTime]) {
      const task = tasks[i - 1];
      selectedTasks.push(task);
      remainingTime -= task.Duration;
    }
  }

  selectedTasks.reverse();

  const totalDuration = selectedTasks.reduce(
    (sum, task) => sum + task.Duration,
    0
  );

  const totalImpact = selectedTasks.reduce(
    (sum, task) => sum + task.Impact,
    0
  );

  return {
    totalDuration,
    totalImpact,
    selectedTasks: selectedTasks.map(task => ({
      taskId: task.TaskID,
      duration: task.Duration,
      impact: task.Impact
    }))
  };
}

module.exports = { scheduleTasks };