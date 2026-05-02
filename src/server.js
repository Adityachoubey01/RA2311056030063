require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { fetchFromApi } = require("./apiClient");
const { scheduleTasks } = require("./scheduler");
const { getTopNotifications } = require("./notificationPriority");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Vehicle Maintenance Scheduler Microservice is running"
  });
});

app.get("/schedule-maintenance", async (req, res) => {
  try {
    const token = req.headers.authorization;

    const depotData = await fetchFromApi("/depots", token);
    const vehicleData = await fetchFromApi("/vehicles", token);

    const depots = depotData.depots || [];
    const vehicles = vehicleData.vehicles || [];

    const result = depots.map(depot => {
      const schedule = scheduleTasks(vehicles, depot.MechanicHours);

      return {
        depotId: depot.ID,
        mechanicHours: depot.MechanicHours,
        usedHours: schedule.totalDuration,
        unusedHours: depot.MechanicHours - schedule.totalDuration,
        totalImpact: schedule.totalImpact,
        selectedTasks: schedule.selectedTasks
      };
    });

    res.status(200).json({
      message: "Maintenance schedule generated successfully",
      schedules: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate maintenance schedule",
      error: error.response?.data || error.message
    });
  }
});

app.get("/priority-notifications", async (req, res) => {
  try {
    const token = req.headers.authorization;

    const notificationData = await fetchFromApi("/notifications", token);
    const notifications = notificationData.notifications || [];

    const topNotifications = getTopNotifications(notifications, 10);

    res.status(200).json({
      message: "Top priority notifications fetched successfully",
      count: topNotifications.length,
      notifications: topNotifications
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch priority notifications",
      error: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});