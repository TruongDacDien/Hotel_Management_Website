class RoomController {
    constructor(service) {
        this.service = service;

        this.getAll = this.getAll.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res, next) {
        try {
            const data = await this.service.getAll();
            res.json(data);
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const { roomId } = req.params;
            const item = await this.service.getById(roomId);
            res.json(item);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const newItem = await this.service.create(req.body);
            res.status(201).json(newItem);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const { roomId } = req.params;
            const updated = await this.service.update(roomId, req.body);
            res.json(updated);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const { roomId } = req.params;
            await this.service.delete(roomId);
            res.status(204).end();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = RoomController;