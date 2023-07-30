const {Model} = require("mongoose")

const asyncHandler = require("express-async-handler")

const getAllData = Model => asyncHandler (async (req, res) =>{
    console.log(req.user._id)
    const data = await Model.find();
    if(data) return res.status(200).json(data)
    return res.status(404).json("There was an error")
})

const createNewDoc = Model => asyncHandler (async (req, res) =>{

    const newOne = await Model.create(req.body)

    return res.status(200).json(newOne)
})

const deleteDoc = Model => asyncHandler( async (req, res) => {

    const deleted = await Model.findByIdAndDelete(req.params.id, {new: true})

    if(!deleted) return res.status(404).json("There is no document with that ID!", 404)

    return res.status(200).json(deleted)
})

const updateDoc = Model => asyncHandler(async (req, res ,next) =>{

    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    if(!updatedDoc) return res.status(404).json('No doc found with that ID!')
    
    return res.status(200).json(updatedDoc)
})

const getDoc = Model => asyncHandler (async (req, res) =>{

    const data = await Model.findById(req.params.id);

    if(data) return res.status(200).json(data)
    return res.status(404).json("There was an error")
})

module.exports = {
    getAllData,
    createNewDoc,
    deleteDoc,
    updateDoc,
    getDoc
}