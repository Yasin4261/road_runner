const Runner = require('../models/Runner');
const notificationService = require('./notificationService');

class QueueService {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    enqueue(notification) {
        this.queue.push(notification);
        this.processQueue();
    }

    async processQueue() {
        if (this.processing) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const notification = this.queue.shift();
            await this.sendNotification(notification);
        }

        this.processing = false;
    }

    async sendNotification(notification) {
        const nextRunner = await this.getNextRunner();
        if (nextRunner) {
            notification.runnerId = nextRunner._id;
            await notificationService.send(notification);
            await this.removeRunnerFromQueue(nextRunner._id);
        }
    }

    async addRunnerToQueue(runnerId) {
        const runner = await Runner.findById(runnerId);
        if (!runner) throw new Error('Runner not found');

        if (runner.queuePosition !== null && runner.currentStatus === 'available') {
            throw new Error('Runner is already in queue');
        }

        const lastInQueue = await Runner.findOne({
            queuePosition: { $ne: null }
        }).sort({ queuePosition: -1 });

        const newPosition = lastInQueue ? lastInQueue.queuePosition + 1 : 1;

        runner.queuePosition = newPosition;
        runner.currentStatus = 'available';
        runner.shiftStartTime = new Date();
        
        await runner.save();
        return runner;
    }

    async removeRunnerFromQueue(runnerId) {
        const runner = await Runner.findById(runnerId);
        if (!runner) throw new Error('Runner not found');

        if (runner.queuePosition === null) {
            return runner;
        }

        const oldPosition = runner.queuePosition;
        runner.queuePosition = null;
        runner.currentStatus = 'offline';
        runner.shiftStartTime = null;
        
        await Promise.all([
            runner.save(),
            Runner.updateMany(
                { queuePosition: { $gt: oldPosition } },
                { $inc: { queuePosition: -1 } }
            )
        ]);

        return runner;
    }

    async getNextRunner() {
        return await Runner.findOne({
            currentStatus: 'available',
            queuePosition: { $ne: null }
        }).sort({ queuePosition: 1 });
    }

    async getQueue() {
        return await Runner.find({
            currentStatus: 'available',
            queuePosition: { $ne: null }
        }).sort({ queuePosition: 1 });
    }

    async reorderQueue() {
        const runners = await Runner.find({
            queuePosition: { $ne: null }
        }).sort({ queuePosition: 1 });

        for (let i = 0; i < runners.length; i++) {
            runners[i].queuePosition = i + 1;
            await runners[i].save();
        }

        return runners;
    }
}

module.exports = new QueueService();
