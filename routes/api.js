const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const ContactMessage = require('../models/ContactMessage');

// Mark message as read
router.put('/messages/:id/read', isAuthenticated, async (req, res) => {
    try {
        await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Delete message
router.delete('/messages/:id', isAuthenticated, async (req, res) => {
    try {
        await ContactMessage.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;
