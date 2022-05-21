const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
//const taskValidation = require('../../validations/task.validation');
//const taskController = require('../../controllers/task.controller');

const router = express.Router();

require('./twitterCook');
const {
    createTask,
    getTaskStatus
} = require('./taskWaiter');

router
.route('/:id')
.get(function (req, res, next) {
    console.log(req.params.id);
    let taskId = req.params.id;
    if (!taskId) {
        res.sendStatus(400);
        return;
    };
    
    getTaskStatus(taskId).then((result) => {
        res.json({
            progress: result.status == "succeeded" ? `Your task is ready 😊` : `Your task is ⏲ ${result.progress}% ready`,
            task: result.task,
            status: result.status
        })
    }).catch((err) => {
        res.sendStatus(500);
    });
});



// Change order to task; parameter hashtag
router
.route('/')
.post(function (req, res, next) {
    let task = {
        hashtag: req.body.hashtag,
        userid : "Chandra"
    }

    if (task.hashtag) {
        createTask(task)
            .then((job) => res.json({
                done: true,
                task: job.id,
                message: "Your task will be ready in a while"
            }))
            .catch(() => res.json({
                done: false,
                message: "Your task could not be placed"
            }));
    } else {
        res.status(422);
    }
});

module.exports = router;
