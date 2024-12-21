const runnerRepository = require('../repositories/runnerRepository');

class RunnerService {
    async createRunner(data) {
        return await runnerRepository.create(data);
    }

    async getRunnerById(runnerId) {
        return await runnerRepository.getRunnerById(runnerId);
    }

    async getAllRunners() {
        return await runnerRepository.findAll();
    }

    async deleteRunner(runnerId) {
        return await runnerRepository.deleteById(runnerId);
    }
}


module.exports = new RunnerService();