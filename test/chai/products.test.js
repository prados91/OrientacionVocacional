import { expect } from "chai";
import "dotenv/config.js";
import dao from "../../src/data/index.factory.js";
const { products } = dao;

describe("Testing: Products Model", () => {
    const model = products;
    const data = { title: "ProductoTest", category: "test" };
    let id;
    it("La creación del producto requiere un objeto con la propiedad title", () => {
        expect(data).to.have.property("title");
    });
    it("La creación del producto requiere un objeto con la propiedad category", () => {
        expect(data).to.have.property("category");
    });
    it("La función creadora de un producto, devuelve un objeto", async () => {
        const one = await model.create(data);
        id = one._id;
        expect(one).to.be.an("object");
    });
    it("La función para eliminar un producto debe efectivamente eliminarlo", async () => {
        const one = await model.destroy(id);
        expect(one).to.have.property("_id");
    });
    it("La función creadora de un producto, devuelve un objeto con la propiedad '_id'", async () => {
        const one = await model.create(data);
        id = one._id;
        expect(one).to.have.property("_id");
    });
    it("La función para leer productos debe devolver un objeto con la propiedad 'prevPage'", async () => {
        const filter = {};
        const options = {
            page: 2,
            limit: 2,
        };
        const all = await model.read({ filter, options });
        expect(all).to.have.property("prevPage");
    });
    it("La función para leer productos debe devolver un objeto con la propiedad 'nextPage'", async () => {
        const filter = {};
        const options = {
            page: 2,
            limit: 2,
        };
        const all = await model.read({ filter, options });
        expect(all).to.have.property("nextPage");
    });
    it("La función para leer productos debe devolver un array de objetos con la propiedad category'", async () => {
        const filter = {};
        const options = {
            page: 2,
            limit: 2,
        };
        const all = await model.read({ filter, options });
        expect(all.docs[0]).to.have.property("category");
    });
    it("La función para actualizar un producto debe devolver un objeto con el producto actualizado", async () => {
        const before = await model.readOne(id);
        const one = await model.update(id, { title: "TestProducto" });
        expect(one.title).not.to.be.equals(before.title);
    });
    it("La función para eliminar un producto debe efectivamente eliminarlo", async () => {
        const one = await model.destroy(id);
        expect(one).to.have.property("_id");
    });
});
