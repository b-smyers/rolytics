async function logData(req, res) {
    console.log(req.body);
    res.status(200).json({ message: 'Data successfully recieved' });
}

module.exports = {
    logData
}