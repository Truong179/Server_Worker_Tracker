const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // thêm dòng này trên cùng
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
// Kết nối MongoDB
app.get("/test-auth", (req, res) => {
  res.send("Auth route is working");
});
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

  try {
    const record = await Workout.findOne({ date, dayCode }); // <-- lấy đúng ngày
    if (record) {
      res.json(record);
    } else {
      res.json({ checked: [] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server is running on http://localhost:${PORT}`));
