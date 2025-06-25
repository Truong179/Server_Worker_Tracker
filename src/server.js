const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // thêm dòng này trên cùng
const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


// Schema bài tập
const workoutSchema = new mongoose.Schema({
  date: String,
  dayCode: String,
  checked: [Boolean]
});

const Workout = mongoose.model("Workout", workoutSchema);

// API lưu dữ liệu
app.post("/api/workouts", async (req, res) => {
  const { date, dayCode, checked } = req.body;
  try {
    const existing = await Workout.findOne({ date, dayCode });
    if (existing) {
      existing.checked = checked;
      await existing.save();
    } else {
      await Workout.create({ date, dayCode, checked });
    }
    res.json({ message: "Saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API lấy dữ liệu theo ngày
app.get("/api/workouts/:date/:dayCode", async (req, res) => {
  const { date, dayCode } = req.params;
  const record = await Workout.findOne({ date, dayCode });
  if (record) {
    res.json(record);
  } else {
    res.json({ checked: [] });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
