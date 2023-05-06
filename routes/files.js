const router = require('express').Router();
const Controller = require('../controllers/files');

router.post('/',Controller.pushFile);
router.get('/:uuid',Controller.showFile);
router.get('/download/:uuid',Controller.downloadFile);
router.post('/send',Controller.sendEmail)
module.exports = router; 
