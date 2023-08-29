const express = require("express");
const { protect } = require("../middlewares/authMiddlewares");

const router = express.Router();

const {
    getOneNotification,
    deleteOneNotification,
    markNotificationAsRead,
    getAllNotificationsForPerson,
    markAllAsRead,
    deleteAllNotifications
} = require("../controllers/notificationController")

router.use(protect)

router.route('/:id').get(getOneNotification).delete(deleteOneNotification).patch(markNotificationAsRead)
router.route('/').get(getAllNotificationsForPerson).patch(markAllAsRead).delete(deleteAllNotifications)

module.exports = router


