class ServiceController {
    constructor(serviceService) {
        this.serviceService = serviceService;
        
        // Bind all methods
        this.getAllServices = this.getAllServices.bind(this);
        this.getServiceById = this.getServiceById.bind(this);
        this.getServicesByCategory = this.getServicesByCategory.bind(this);
        this.createService = this.createService.bind(this);
        this.updateService = this.updateService.bind(this);
        this.deleteService = this.deleteService.bind(this);
        this.restoreService = this.restoreService.bind(this);
    }

    async getAllServices(req, res, next) {
        try {
            const includeDeleted = req.query.includeDeleted === 'true';
            const services = await this.serviceService.getAllServices(includeDeleted);
            res.json(services);
        } catch (err) {
            next(err);
        }
    }

    async getServiceById(req, res, next) {
        try {
            const service = await this.serviceService.getServiceById(req.params.id);
            res.json(service);
        } catch (err) {
            next(err);
        }
    }

    async getServicesByCategory(req, res, next) {
        try {
            const services = await this.serviceService.getServicesByCategory(req.params.categoryId);
            res.json(services);
        } catch (err) {
            next(err);
        }
    }

    async createService(req, res, next) {
        try {
            const newService = await this.serviceService.createService(req.body);
            res.status(201).json(newService);
        } catch (err) {
            next(err);
        }
    }

    async updateService(req, res, next) {
        try {
            const updatedService = await this.serviceService.updateService(
                req.params.id,
                req.body
            );
            res.json(updatedService);
        } catch (err) {
            next(err);
        }
    }

    async deleteService(req, res, next) {
        try {
            await this.serviceService.deleteService(req.params.id);
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }

    async restoreService(req, res, next) {
        try {
            await this.serviceService.restoreService(req.params.id);
            res.status(200).json({ message: 'Service restored successfully' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ServiceController;