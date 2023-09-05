
const express = require('express')
const router = express.Router()

const {
    protect, restrictTo
} = require("../middlewares/authMiddlewares")
const { 
    getMe,
    updateInfo,
    deleteMyAccount,
    banUserProfile,
    editPatientData,
    getAllPatients,
    getPatient
} = require('../controllers/patientController')

router.use(protect)

router.get("/get-me", restrictTo('PATIENT'), getMe)
router.patch("/edit-my-profile", restrictTo('PATIENT'), updateInfo)
router.delete("/delete-my-account", restrictTo('PATIENT'), deleteMyAccount)

router.patch("/ban-user/:id",restrictTo('HOSPITAL'), banUserProfile)
router.patch("/edit-patient/:id",restrictTo('HOSPITAL'), editPatientData)

router.get("/", restrictTo('HOSPITAL', 'DOCTOR'), getAllPatients)
router.get("/:id", restrictTo('HOSPITAL', 'DOCTOR'), getPatient)

module.exports = router