function getNotificationScore(notification) {
  let score = 0;

  const type = notification.Type?.toLowerCase();

  if (type === "placement") score += 50;
  else if (type === "event") score += 35;
  else if (type === "result") score += 25;
  else score += 10;

  const createdTime = new Date(notification.Timestamp).getTime();
  const currentTime = Date.now();

  const ageInHours = (currentTime - createdTime) / (1000 * 60 * 60);

  if (ageInHours <= 24) score += 30;
  else if (ageInHours <= 72) score += 20;
  else if (ageInHours <= 168) score += 10;

  return score;
}

function getTopNotifications(notifications, limit = 10) {
  return notifications
    .map(notification => ({
      ...notification,
      priorityScore: getNotificationScore(notification)
    }))
    .sort((a, b) => {
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }

      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, limit);
}

module.exports = { getTopNotifications };