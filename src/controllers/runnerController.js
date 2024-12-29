const Runner = require('../models/Runner');
const queueService = require('../services/queueService');

class RunnerController {
    // Tüm kuryeleri getir
    async getAllRunners(req, res) {
        try {
            const runners = await Runner.find({});
            res.json(runners);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Yeni kurye oluştur
    async createRunner(req, res) {
        try {
            const runner = new Runner(req.body);
            await runner.save();
            res.status(201).json(runner);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Vardiyaya başla
    async startShift(req, res) {
        try {
            const runner = await Runner.findById(req.params.id);
            if (!runner) {
                return res.status(404).json({ message: 'Kurye bulunamadı' });
            }

            // Zaten vardiyada mı kontrol et
            if (runner.currentStatus !== 'offline') {
                return res.status(400).json({ 
                    message: 'Kurye zaten vardiyada'
                });
            }

            // Vardiyaya başlat
            runner.currentStatus = 'available';
            runner.shiftStartTime = new Date();
            await runner.save();

            // Kuyruğa ekle
            await queueService.addRunnerToQueue(runner._id);

            res.json(runner);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Vardiyadan çık
    async endShift(req, res) {
        try {
            const runner = await Runner.findById(req.params.id);
            if (!runner) {
                return res.status(404).json({ message: 'Kurye bulunamadı' });
            }

            // Vardiyada mı kontrol et
            if (runner.currentStatus === 'offline') {
                return res.status(400).json({ 
                    message: 'Kurye zaten vardiyada değil'
                });
            }

            // Aktif siparişi var mı kontrol et
            if (runner.currentStatus === 'busy') {
                return res.status(400).json({ 
                    message: 'Aktif siparişi olan kurye vardiyadan çıkamaz'
                });
            }

            // Vardiyadan çıkar
            runner.currentStatus = 'offline';
            runner.shiftStartTime = null;
            await runner.save();

            // Kuyruktan çıkar
            await queueService.removeRunnerFromQueue(runner._id);

            res.json(runner);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Kurye kuyruğunu getir
    async getQueue(req, res) {
        try {
            // Sadece vardiyada olan kuryeleri getir
            const queue = await Runner.find({
                currentStatus: 'available',
                shiftStartTime: { $ne: null }
            }).sort({ queuePosition: 1 });

            res.json(queue);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new RunnerController(); 