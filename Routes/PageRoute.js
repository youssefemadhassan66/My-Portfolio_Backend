const path = require('path');
const express = require('express');
const app = express();
const router = express.Router();
const { updatePage, getPage } = require('../Controllers/PageConroller');
const authMiddleware = require('../Middlewares/authMiddleware');
const uploadHandler = require('../Middlewares/MulterConfig');

router.post('/dashboard/:pageName', uploadHandler.any(), updatePage);

router.get('/dashboard/:pageName',authMiddleware,(req,res)=>{
    res.status(201).send('authorized successfully');

});

router.get('/:pageName', getPage);


module.exports = router;
    