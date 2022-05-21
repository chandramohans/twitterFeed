const Queue = require('bee-queue');

const options = {
    isWorker: false,
    sendEvents: false,
    redis: {
        host: process.env.REDIS_HOSTNAME,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        },
}

const taskQueue = new Queue('task', options);

const createTask = (task) => {
    return taskQueue.createJob(task).save();
};

taskQueue.on("succeeded", (job) => {
    // Notify the client via push notification, web socket or email etc.
    console.log(`🧾 ${job.data.hashtag} ready in MongoDB`);
});

const getTaskStatus = (taskId) => {
    return taskQueue.getJob(taskId).then((job) => {
        return {
            progress: job.progress,
            status: job.status,
            task: job.data
        };
    });
}

module.exports = {
    createTask: createTask,
    getTaskStatus: getTaskStatus
};