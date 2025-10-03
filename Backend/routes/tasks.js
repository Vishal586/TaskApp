const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all tasks for the authenticated user
router.get('/', [
    query('search').optional().isString().trim(),
    query('status').optional().isIn(['pending', 'in-progress', 'completed'])
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Invalid query parameters',
                errors: errors.array()
            });
        }

        const { search, status } = req.query;
        const userId = req.user._id;

        // Build query
        const query = { userId };

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .limit(100); // Limit to prevent large responses

        res.json(tasks);
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Server error while fetching tasks' });
    }
});

// Get single task
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error('Get task error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid task ID' });
        }
        res.status(500).json({ message: 'Server error while fetching task' });
    }
});

// Create new task
router.post('/', [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters')
        .trim(),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters')
        .trim(),
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status must be pending, in-progress, or completed')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { title, description, status = 'pending' } = req.body;
        const userId = req.user._id;

        const task = new Task({
            title,
            description,
            status,
            userId
        });

        await task.save();

        res.status(201).json({
            message: 'Task created successfully',
            ...task.toObject()
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error while creating task' });
    }
});

// Update task
router.put('/:id', [
    body('title')
        .optional()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters')
        .trim(),
    body('description')
        .optional()
        .notEmpty()
        .withMessage('Description cannot be empty')
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters')
        .trim(),
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status must be pending, in-progress, or completed')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { title, description, status } = req.body;
        const taskId = req.params.id;
        const userId = req.user._id;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (status !== undefined) updateData.status = status;

        const task = await Task.findOneAndUpdate(
            { _id: taskId, userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({
            message: 'Task updated successfully',
            ...task.toObject()
        });
    } catch (error) {
        console.error('Update task error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid task ID' });
        }
        res.status(500).json({ message: 'Server error while updating task' });
    }
});

// Delete task
router.delete('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user._id;

        const task = await Task.findOneAndDelete({ _id: taskId, userId });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid task ID' });
        }
        res.status(500).json({ message: 'Server error while deleting task' });
    }
});

module.exports = router;