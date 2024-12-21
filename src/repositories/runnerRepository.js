const Runner = require('../models/Runner');

class RunnerRepository {
    async create(data) {
        const runner = new Runner(data);

        return await runner.save();
    }

    async findById(Id) {
        return await Runner.findById(Id);
    }

    async findAll() {
        return await Runner.find();
    }

    async deleteById(Id) {
        return await Runner.findByIdAndRemove(Id);
    }
}

module.exports = new RunnerRepository();