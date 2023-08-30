const { getDoc, deleteDoc, updateDoc } = require("./handleController")
const asyncHandler = require("express-async-handler")
const Notification = require("../models/notification")

const getOneNotification = getDoc(Notification)
const deleteOneNotification = deleteDoc(Notification)
const markNotificationAsRead = updateDoc(Notification)

const getAllNotificationsForPerson = asyncHandler( async(req, res) => {
    const user = req.user;

    const notificationsForUser = await Notification.find({user_id: user._id}).sort({createdAt: -1}).exec()

    if(!notificationsForUser) return res.status(404).json("There are no notifications!")
    return res.status(200).json(notificationsForUser)
})

const markAllAsRead = asyncHandler( async(req, res) => {
    const user = req.user;

    const notificationsForUser = await Notification.updateMany({user_id: user._id, read: false}, {$set: {read:true}})
    if(!notificationsForUser) return res.status(404).json("There are no notifications to mark!")
    
    const updatedNotifications = await Notification.find({
        user_id: user._id,
        read: true
    })

    return res.status(200).json(updatedNotifications)
})

const deleteAllNotifications = asyncHandler( async(req, res) => {
    const user = req.user;

    await Notification.deleteMany({user_id: user._id})
    return res.status(200).json('All notifications deleted.')
})

module.exports = {
    getOneNotification,
    deleteOneNotification,
    markNotificationAsRead,
    getAllNotificationsForPerson,
    markAllAsRead,
    deleteAllNotifications
}


