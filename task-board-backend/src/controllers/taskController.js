const Task = require('../models/Task');

//GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('creator', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      title,
      description,
      creator: req.user._id,
      status: 'todo',
      assignedTo: null,
    });

    const populated = await task.populate('creator', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//PATCH /api/tasks/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['todo', 'doing', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isCreator = task.creator.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCreator && !isAssignee && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to move this task' });
    }

    task.status = status;
    await task.save();

    const populated = await task.populate([
      { path: 'creator', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//PATCH /api/tasks/:id/assign
const assignTask = async (req, res) => {   
  try {
    const { userId } = req.body || {}; // only used by admins to assign to someone else
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isAdmin = req.user.role === 'admin';

    if (isAdmin) {
      // Admins can assign/reassign to ANY user, ANY time
      task.assignedTo = userId || null;
    } else {
      // Normal users: can only self-assign, and only if currently unassigned
      if (task.assignedTo) {
        return res.status(403).json({ message: 'Task is already assigned' });
      }
      task.assignedTo = req.user._id;
    }

    await task.save();
    const populated = await task.populate([
      { path: 'creator', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//PATCH /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isCreator = task.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to edit this task' });
    }

    const { title, description } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isCreator = task.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateStatus,
  assignTask,
  updateTask,
  deleteTask,
};