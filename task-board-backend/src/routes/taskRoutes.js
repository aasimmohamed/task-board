const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateStatus,
  assignTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

router.use(protect); // every task route requires login

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id/status', updateStatus);
router.patch('/:id/assign', assignTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;