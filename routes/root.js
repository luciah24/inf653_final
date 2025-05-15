const express = require('express');
const router = express.Router();
const path = require('path');



// public HTML (page) root url route 
router.get(['/index.html', '/'], (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});



module.exports = router;

