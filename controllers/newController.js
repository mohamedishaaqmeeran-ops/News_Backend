const New = require('../models/new');
const Channel = require('../models/channel');
const User = require('../models/user');
const sendPushNotification = require("../utils/pushNotification");
const notify = require("../utils/notify");
const Notification = require("../models/Notification");


const getAllNews = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, newsType, newsCategory } = req.query;

        const query = { isActive: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            
            ];
        }

        if (newsType) {
            query.newsType = newsType;
        }

        if (newsCategory) {
            query.newsCategory = newsCategory;
        }
if (req.query.date) {
    const selectedDate = new Date(req.query.date);

    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    query.createdAt = {
        $gte: selectedDate,
        $lt: nextDay
    };
}
       

        const news = await New.find(query)
            .populate('channel', 'name logo')
            .populate('postedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await New.countDocuments(query);

        res.status(200).json({
            news,
            
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalNews: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Fetching all news failed', error: error.message });
    }
}

const getNewById = async (req, res) => {
    try {
        const { id } = req.params;

        const news = await New.findById(id)
            .populate('channel', 'name logo description website')
            .populate('postedBy', 'name');

        if ( !news ) {
            return res.status(404).json({ message: 'News not found' });
        }

        res.status(200).json({ news });
    } catch (error) {
        res.status(500).json({ message: 'Fetching news by ID failed', error: error.message });
    }
}


const createNew = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.assignedChannel) {
            return res.status(400).json({
                message: "No channel assigned to journalist"
            });
        }

        const isBreaking =
            req.body.isBreaking === true || req.body.isBreaking === "true";

        let expiry = req.body.breakingExpiresAt
            ? new Date(req.body.breakingExpiresAt)
            : null;

        if (isBreaking && !expiry) {
            expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }

        if (!isBreaking) {
            expiry = null;
        }

        const newNews = new New({
            title: req.body.title,
            description: req.body.description,
            newsCategory: req.body.newsCategory,
            newsType: req.body.newsType,
            isBreaking,
            breakingPriority: req.body.breakingPriority || 0,
            breakingExpiresAt: expiry,
            image: req.file ? req.file.path : null,
            channel: user.assignedChannel,
            postedBy: req.userId
        });

        const savedNews = await newNews.save();

    
if (savedNews.isBreaking) {

 const users = await User.find({
  fcmToken: { $exists: true, $ne: "" },
  "preferences.notificationsEnabled": true,
  $or: [
    {
      "preferences.categories": {
        $elemMatch: {
          $regex: new RegExp(`^${savedNews.newsCategory}$`, "i")
        }
      }
    },
    {
      "preferences.categories": { $size: 0 }
    }
  ]
});

  console.log("Users found:", users.length);

  for (const u of users) {
    await Notification.create({
      userId: u._id,
      title: "🚨 Breaking News",
      body: savedNews.title,
      newsId: savedNews._id.toString(),
      category: savedNews.newsCategory.toLowerCase(),
      sent: false
    });
  }

  const immediateUsers = users.filter(
    u => u.preferences.frequency === "immediate"
  );

  console.log("Immediate users:", immediateUsers.length);

  const tokens = immediateUsers.map(u => u.fcmToken).filter(Boolean);

  console.log("Tokens:", tokens);

  if (tokens.length > 0) {
    console.log("Sending notification...");

    await notify(
      "🚨 Breaking News",
      savedNews.title,
      { newsId: savedNews._id.toString() },
      tokens
    );

    await Notification.updateMany(
      {
        userId: { $in: immediateUsers.map(u => u._id) },
        newsId: savedNews._id.toString()
      },
      { sent: true }
    );
  }
}
        res.status(201).json({
            message: "News created successfully",
            news: savedNews
        });

    } catch (error) {
        console.log("❌ CREATE NEWS ERROR:", error);

        res.status(500).json({
            message: "Creating news failed",
            error: error.message
        });
    }
};


const fs = require("fs");
const path = require("path");
const updateNew = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (req.file) {
            const existingNews = await New.findById(id);

            
            if (existingNews?.image && fs.existsSync(existingNews.image)) {
                fs.unlinkSync(existingNews.image);
            }

            updates.image = req.file.path;
        }

        const updatedNew = await New.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        )
            .populate('channel', 'name logo')
            .populate('postedBy', 'name');

        if (!updatedNew) {
            return res.status(404).json({ message: 'News not found' });
        }

        res.status(200).json({
            message: 'News updated successfully',
            news: updatedNew
        });

    } catch (error) {
        res.status(500).json({
            message: 'Updating news failed',
            error: error.message
        });
    }
};

const deleteNew = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedNew = await New.findByIdAndDelete(id);

        if (!deletedNew) {
            return res.status(404).json({ message: 'news not found' });
        }

        res.status(200).json({ message: 'News deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Deleting news failed', error: error.message });
    }
}

const getJournalistNews = async (req, res) => {
    try {
        const news = await New.find({ postedBy: req.userId })
            .populate('channel', 'name logo')
            .sort({ createdAt: -1 });

        res.status(200).json({ news });
    } catch (error) {
        res.status(500).json({ message: 'Fetching Journalist news failed', error: error.message });
    }
}

const getBreakingNews = async (req, res) => {
    try {
       
        const news = await New.find({ isBreaking: true })
            .populate('channel', 'name logo')
            .populate('postedBy', 'name')
            .sort({ breakingPriority: 1, createdAt: -1 });
            if (news.length === 0) {
                return res.status(404).json({ message: 'No breaking news found' });
            }
        res.status(200).json({ news });
    } catch (error) {
        res.status(500).json({ message: 'Fetching breaking news failed', error: error.message });
    }   }

const getNewsByChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const news = await New.find({ channel: channelId, isActive: true })
            .populate('channel', 'name logo')
            .populate('postedBy', 'name')
            .sort({ createdAt: -1 });   
        res.status(200).json({ news });
    } catch (error) {
        res.status(500).json({ message: 'Fetching news by channel failed', error: error.message });
    }
}


const getNewsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const news = await New.find({ newsCategory: category, isActive: true })
            .populate('channel', 'name logo')
            .populate('postedBy', 'name')
            .sort({ createdAt: -1 });   
        res.status(200).json({ news });
    } catch (error) {   
        res.status(500).json({ message: 'Fetching news by category failed', error: error.message });
    }
}


const getNewsByType = async (req, res) => {
     try {
        const { type } = req.params;

        const allowedTypes = ['Domestic', 'International'];
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ message: 'Invalid news type' });
        }

        const news = await New.find({ 
            newsType: type, 
            isActive: true 
        })
        .populate('channel', 'name logo')   
        .populate('postedBy', 'name')
        .sort({ createdAt: -1 });   

        res.status(200).json({ news });
    }
        catch (error) {
        res.status(500).json({ message: 'Fetching news by type failed', error: error.message });
    }
}

const getJournalistChannels = async (req, res) => {
    try {
        const channels = await Channel.find()
            .populate('createdBy', 'name email');

        res.status(200).json({ channels });

    } catch (error) {
        res.status(500).json({ 
            message: 'Fetching Journalist channels failed', 
            error: error.message 
        });
    }
};


const getJournalistBreakingNews = async (req, res) => {
    try {
        const news = await New.find({
            postedBy: req.userId,
            isBreaking: true
        })
        .populate('channel', 'name logo')
        .sort({ breakingPriority: 1, createdAt: -1 });
        if (news.length === 0) {
            return res.status(404).json({ message: 'No breaking news found for this journalist' });
        }
        res.status(200).json({ news });}
catch (error) {
        res.status(500).json({ message: 'Fetching journalist breaking news failed', error: error.message });
}};


module.exports = {
    getAllNews,
    getNewById,
    createNew,
    updateNew,
    deleteNew,
    getJournalistNews,
    getBreakingNews,
    getNewsByChannel,
    getNewsByCategory,
    getNewsByType,
    getJournalistChannels,
    getJournalistBreakingNews
    
}