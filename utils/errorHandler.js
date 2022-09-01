module.exports = (res, error) => {
    // Iternal server error
    res.status(500).json({
        success: false,
        message: error.message ? error.message : error
    })
}