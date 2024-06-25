import fs from "fs";

class ProductsManager {
    init() {
        try {
            const exists = fs.existsSync(this.path);
            if (!exists) {
                const data = JSON.stringify([], null, 2);
                fs.writeFileSync(this.path, data);
            } else {
                this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            }
        } catch (error) {
            throw error;
        }
    }
    constructor(path) {
        this.path = path;
        this.products = [];
        this.init();
    }
    async create(data) {
        try {
            this.products.push(data);
            const jsonData = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, jsonData);
            return data;
        } catch (error) {
            throw error;
        }
    }
    read({ filter, options }) {
        try {
            if (this.products.length === 0) {
                const error = new Error("NOT FOUND!");
                error.statusCode = 404;
                throw error;
            }
            let filteredProducts = this.products.filter((product) => {
                for (let key in filter) {
                    if (product[key] !== filter[key]) {
                        return false;
                    }
                }
                return true;
            });
            if (options.sort) {
                const [key, order] = Object.entries(options.sort)[0];
                filteredProducts.sort((a, b) => {
                    if (a[key] < b[key]) return order === "asc" ? -1 : 1;
                    if (a[key] > b[key]) return order === "asc" ? 1 : -1;
                    return 0;
                });
            }

            const page = options.page || 1;
            const limit = options.limit || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
            const result = {
                docs: paginatedProducts,
                totalDocs: filteredProducts.length,
                limit: limit,
                totalPages: Math.ceil(filteredProducts.length / limit),
                page: page,
                pagingCounter: startIndex + 1,
                hasPrevPage: page > 1,
                hasNextPage: endIndex < filteredProducts.length,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: endIndex < filteredProducts.length ? page + 1 : null,
            };
            return result;
        } catch (error) {
            throw error;
        }
    }
    readOne(id) {
        try {
            const one = this.products.find((each) => each._id === id);
            if (!one) {
                const error = new Error("NOT FOUND!");
                error.statusCode = 404;
                throw error;
            }
            return one;
        } catch (error) {
            throw error;
        }
    }
    readByEmail(email) {
        try {
            const one = this.products.find((each) => each.email === email);
            if (!one) {
                const error = new Error("NOT FOUND!");
                error.statusCode = 404;
                throw error;
            }
            return one;
        } catch (error) {
            throw error;
        }
    }
    async update(id, data) {
        try {
            const index = this.products.findIndex((each) => each._id === id);
            if (index === -1) {
                const error = new Error("NOT FOUND!");
                error.statusCode = 404;
                throw error;
            }
            this.products[index] = { ...this.products[index], ...data };
            const jsonData = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, jsonData);
            return this.products[index];
        } catch (error) {
            throw error;
        }
    }
    async destroy(id) {
        try {
            const index = this.products.findIndex((each) => each._id === id);
            if (index === -1) {
                const error = new Error("NOT FOUND!");
                error.statusCode = 404;
                throw error;
            }
            const [deletedProduct] = this.products.splice(index, 1);
            const jsonData = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, jsonData);
            return deletedProduct;
        } catch (error) {
            throw error;
        }
    }
}

const products = new ProductsManager("./src/data/fs/files/products.json");
export default products;
