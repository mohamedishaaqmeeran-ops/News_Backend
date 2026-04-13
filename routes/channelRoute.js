const express = require('express');
const {
    createChannel,
    getAllChannel,
    updateChannel,
    deleteChannel,
    createJournalists,
    getAllJournalists,
        deleteJournalist,
        updateJournalist
} = require('../controllers/adminController');

const { isAuthenticated, allowRoles } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const channelRouter = express.Router();


channelRouter.use(isAuthenticated);
channelRouter.use(allowRoles(['admin']));


channelRouter.post(
    '/',
    upload.single('channelLogo'), 
    createChannel
);


channelRouter.get('/', getAllChannel);

channelRouter.put(
    '/:id',
    upload.single('channelLogo'), 
    updateChannel
);


channelRouter.delete('/:id', deleteChannel);


channelRouter.post('/journalists', createJournalists);
channelRouter.get('/journalists', getAllJournalists);
channelRouter.delete('/journalists/:id', deleteJournalist);
channelRouter.put('/journalists/:id', updateJournalist);

module.exports = channelRouter;