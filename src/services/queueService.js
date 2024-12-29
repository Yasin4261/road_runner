const Runner = require('../models/Runner');

class QueueService {
    async addRunnerToQueue(runnerId) {
        const runner = await Runner.findById(runnerId);
        if (!runner) throw new Error('Runner not found');

        // Zaten kuyrukta mı kontrol et
        if (runner.queuePosition !== null && runner.currentStatus === 'available') {
            throw new Error('Runner is already in queue');
        }

        // Kuyruğun sonuna ekle
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

        // Kuyrukta değilse hata verme, sessizce çık
        if (runner.queuePosition === null) {
            return runner;
        }

        const oldPosition = runner.queuePosition;
        runner.queuePosition = null;
        runner.currentStatus = 'offline';
        runner.shiftStartTime = null;
        
        await Promise.all([
            runner.save(),
            // Diğer kuryelerin pozisyonlarını güncelle
            Runner.updateMany(
                { queuePosition: { $gt: oldPosition } },
                { $inc: { queuePosition: -1 } }
            )
        ]);

        return runner;
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

        // Pozisyonları sırayla güncelle
        for (let i = 0; i < runners.length; i++) {
            runners[i].queuePosition = i + 1;
            await runners[i].save();
        }

        return runners;
    }
}

module.exports = new QueueService();
