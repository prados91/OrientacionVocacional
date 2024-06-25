import ProductDTO from "../dto/product.dto.js";
import dao from "../data/index.factory.js";

const { products } = dao;

class ProductsRep {
    constructor() {
        this.model = products;
    }
    create = async (data) => {
        data = new ProductDTO(data);
        const response = await this.model.create(data);
        return response;
    };
    read = async ({ filter, options }) => await this.model.read({ filter, options });
    readOne = async (id) => await this.model.readOne(id);
    update = async (id, data) => await this.model.update(id, data);
    destroy = async (id) => await this.model.destroy(id);
}

const repository = new ProductsRep();
export default repository;
