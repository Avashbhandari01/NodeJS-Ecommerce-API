const { Notification } = require('../database/dbConfig');

// Get all notifications
const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();

        res.status(200).json({ status: "ok", data: notifications });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Post a notifications
const postNotification = async (req, res) => {
    const { Title, Body } = req.body;

    if (!Title || !Body) {
        return res.status(400).json({ error: "Please enter all the textfields!" });
    }

    try {
        const notification = await Notification.create({
            Title,
            Body,
        });

        res.status(200).json({ status: "ok", data: notification });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getAllNotifications, postNotification }