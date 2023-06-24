const AppError = require('./../utils/AppError')

const notFound = ('*',(req,res,next)=>{
    next(new AppError(`Can't Find this ${req.originalUrl} on This Server!`,404))
})

module.exports = notFound;