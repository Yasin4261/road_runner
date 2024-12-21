const runnerService = require('../services/runnerService');
const { handleError, handleSuccess } = require('../utils/responseHelper');

class RunnerController {
    async createRunner(req, res) {
        try{
            const runner = await runnerService.createRunner(req.body);
            return handleSuccess(res, 201, runner);
        } catch (error) {
            handleError(res, 500, error.message);
        }
    }
    
    async getRunner(req, res) {
        try {
            const runner = await runnerService.getRunnerById(req.params.id);
            
            if(!runner) return handleError(res, 404, 'Runner not found');
            handleSuccess(res, 200, chef);
        } catch (error) {
            handleError(res, 500, error.message);
        }
    }

    async getAllRunners(req, res) {
        try {
            const runners = await runnerService.getAllRunners();
            handleSuccess(res, 200, runners);            
        } catch (error) {
            handleError(res, 500, error.message);
        }
    }

    async deleteRunner(req, res) {
        try {
            const deletedRunner = await runnerService.deleteRunner(req.params.id);
            if(!deletedRunner) return handleError(res, 404, 'Runner not found');
            handleSuccess(res, 200, {message : 'Runner deleted successfully'});
        } catch (error) {
            handleError(res, 500, error.message);
        }
    }
}

module.exports = new RunnerController();