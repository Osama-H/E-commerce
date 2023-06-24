const mongoose = require('mongoose');
const AppError = require("./AppError");

// const isValidId = (id)=>{
//     if(!mongoose.Types.ObjectId.isValid(id)){
//         return next(new AppError("User Not Found",404))
//     }
// }


const isValidId = (id) =>{
    return (req,res,next)=>{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return next(new AppError("User Not Found",404))
        }
        next();
    }
}

module.exports = isValidId
