import repository from "../repositories/products.rep.js";

class ProductsService {
    constructor() {
        this.repository = repository;
    }
    create = async (data) => await this.repository.create(data);
    read = async ({ filter, options }) => await this.repository.read({ filter, options });
    readOne = async (id) => await this.repository.readOne(id);
    update = async (id, data) => await this.repository.update(id, data);
    destroy = async (id) => await this.repository.destroy(id);
}
const service = new ProductsService();
export default service;
