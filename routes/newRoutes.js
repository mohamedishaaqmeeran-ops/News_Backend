const express = require('express');
const {
  getAllNews,
  getNewById,
  createNew,
  updateNew,
  deleteNew,
  getJournalistNews,
  getBreakingNews,
  getNewsByCategory,
  getNewsByChannel,
  getNewsByType,
  getJournalistChannels,
    getJournalistBreakingNews
} = require('../controllers/newController');

const { isAuthenticated, allowRoles } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const newRouter = express.Router();

newRouter.get('/breaking', isAuthenticated, getBreakingNews);

newRouter.get('/journalist/news', isAuthenticated, allowRoles(['journalist']), getJournalistNews);

newRouter.get('/journalist/channels', isAuthenticated, allowRoles(['journalist']), getJournalistChannels);

newRouter.get('/channel/:channelId', isAuthenticated, getNewsByChannel);

newRouter.get('/type/:type', isAuthenticated, getNewsByType);

newRouter.get('/category/:category', isAuthenticated, getNewsByCategory);

newRouter.get('/', isAuthenticated, getAllNews);

newRouter.post(
  '/',
  isAuthenticated,
  allowRoles(['journalist']),
  upload.single('newsImage'),
  createNew
);


newRouter.put(
  '/:id',
  isAuthenticated,
  allowRoles(['journalist']),
  upload.single('newsImage'),
  updateNew
);


newRouter.delete('/:id', isAuthenticated, allowRoles(['journalist']), deleteNew);


newRouter.get('/:id', isAuthenticated, allowRoles(['journalist', 'user']), getNewById);


newRouter.get('/journalist/breaking', isAuthenticated, allowRoles(['journalist']), getJournalistBreakingNews);


module.exports = newRouter;