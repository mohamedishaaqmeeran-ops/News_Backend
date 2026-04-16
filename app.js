const express = require('express');
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const errorRoute = require('./middlewares/errorRoute');
const logger = require('./middlewares/logger');
const testRoutes = require("./routes/testRoutes");
const cors = require('cors');
const newRouter = require('./routes/newRoutes');
const channelRouter = require('./routes/channelRoute');
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();

app.set('trust proxy', 1);
app.use(cors({
    origin: 'https://ancnews.netlify.app',
    credentials: true
}));

app.use(express.json());


app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use(logger);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/test", testRoutes);
app.use('/api/v1/auth', authRouter);

app.use('/api/v1/channels', channelRouter);
app.use('/api/v1/news', newRouter);


app.use(errorRoute);

module.exports = app;