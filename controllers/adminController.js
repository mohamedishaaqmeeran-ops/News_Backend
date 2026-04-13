const Channel = require('../models/channel');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const createChannel = async (req, res) => {
    try {
        const { name, description, website } = req.body;

        
        const existingChannel = await Channel.findOne({ name });
        if (existingChannel) {
            return res.status(400).json({ message: 'Channel already exists' });
        }

        const newChannel = new Channel({
            name,
            description,
            website,
            createdBy: req.userId,
            logo: req.file ? req.file.path : null   
        });

        const savedChannel = await newChannel.save();

        res.status(201).json({
            message: 'Channel created successfully',
            channel: savedChannel
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to create channel',
            error: error.message
        });
    }
};

const getAllChannel = async (req, res) => {
    try {
        const channels = await Channel.find().populate('createdBy', 'name email');

        res.status(200).json({ channels });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve channels', error: error.message });
    }
}

const updateChannel = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (req.file) {
            updates.logo = req.file.path;
        }

        const updatedChannel = await Channel.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );

        if (!updatedChannel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        res.status(200).json({
            message: 'Channel updated successfully',
            channel: updatedChannel  
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to update channel',
            error: error.message
        });
    }
};

const deleteChannel = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedChannel = await Channel.findByIdAndDelete(id);

        if (!deletedChannel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        res.status(200).json({ message: 'Channel deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete channel', error: error.message });
    }
}

const createJournalists = async (req, res) => {
    try {
        
        const { name, email, password, channelId } = req.body;

        
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const channel = await Channel.findById(channelId);

        if (!channel) {
            return res.status(404).json({ message: 'Channel not found' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newJournalist = new User({
            name,
            email,
            password: hashedPassword,
            role: 'journalist',
            assignedChannel: channelId
        });

        const savedJournalist = await newJournalist.save();

        if (savedJournalist) {
            res.status(201).json({ message: 'Jounalist created successfully', journalist: savedJournalist });
        } else {
            res.status(400).json({ message: 'Failed to create journalist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to create journalist', error: error.message });
    }
}

const getAllJournalists = async (req, res) => {
    try {
        
        const journalists = await User.find({ role: 'journalist' }).populate('assignedChannel', 'name');

        res.status(200).json({ journalists });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve journalists', error: error.message });
    }
}


const deleteJournalist = async (req, res) => {
    try {
        const { id } = req.params;  
        const deletedJournalist = await User.findByIdAndDelete(id);

        if (!deletedJournalist) {
            return res.status(404).json({ message: 'Journalist not found' });
        }
        res.status(200).json({ message: 'Journalist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete journalist', error: error.message });
    }
}


const updateJournalist = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
            if (updates.password) {     
            updates.password = await bcrypt.hash(updates.password, 10);
            }
            const updatedJournalist = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        ).populate('assignedChannel', 'name');
        if (!updatedJournalist) {
            return res.status(404).json({ message: 'Journalist not found' });
        }
        res.status(200).json({
            message: 'Journalist updated successfully',
            journalist: updatedJournalist
        });
    }
        catch (error) {
        res.status(500).json({ message: 'Failed to update journalist', error: error.message });
    }
}

module.exports = {
    createChannel,
    getAllChannel,
    updateChannel,
    deleteChannel,
    createJournalists,
    getAllJournalists,
    deleteJournalist,
    updateJournalist
}