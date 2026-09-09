const User = require('../models/User');
const Task = require('../models/Task');

//GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ name: 1 }).lean();

    const [assignedCounts, createdCounts] = await Promise.all([
      Task.aggregate([
        { $match: { assignedTo: { $ne: null } } },
        { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
      ]),
      Task.aggregate([{ $group: { _id: '$creator', count: { $sum: 1 } } }]),
    ]);

    const assignedMap = Object.fromEntries(assignedCounts.map((c) => [c._id.toString(), c.count]));
    const createdMap = Object.fromEntries(createdCounts.map((c) => [c._id.toString(), c.count]));

    const enriched = users.map((u) => ({
      ...u,
      assignedTaskCount: assignedMap[u._id.toString()] || 0,
      createdTaskCount: createdMap[u._id.toString()] || 0,
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers };