import assert from "assert";
import "dotenv/config.js";
import dao from "../../src/data/index.factory.js";
const { products } = dao;

describe("Testeando Modelo PRODUCTOS", () => {
    const model = products;
    const data = { title: "ProductoTest", category: "test" };
    let id;
    it("La creación de un producto requiere un objeto con la propiedad 'title'", () => {
        assert.ok(data.title);
    });
    it("La creación de un producto no necesita un objeto con la propiedad 'photo'", () => {
        assert.strictEqual(data.photo, undefined);
    });
    it("La función creadora de un producto, devuelve un objeto", async () => {
        const one = await model.create(data);
        id = one._id;
        assert.strictEqual(typeof one, "object");
    });
    it("La función para eliminar un producto debe efectivamente eliminar un producto", async () => {
        const one = await model.destroy(id);
        assert.strictEqual(typeof one, "object");
    });
    it("La función creadora de un producto, devuelve un objeto con la propiedad '_id'", async () => {
        const one = await model.create(data);
        id = one._id;
        assert.ok(one._id);
    });
    it("La función para leer productos debe devolver un objeto con la propiedad 'prevPage'", async () => {
        const filter = {};
        const options = {
            page: 2,
            limit: 2,
        };
        const all = await model.read({ filter, options });
        assert.ok(all.prevPage);
    });
    it("La función para leer productos debe devolver un objeto con la propiedad 'nextPage'", async () => {
        const filter = {};
        const options = {
            page: 2,
            limit: 2,
        };
        const all = await model.read({ filter, options });
        assert.ok(all.nextPage);
    });
    it("La función para leer productos debe devolver un objeto con la propiedad docs'", async () => {
        const filter = {};
        const options = {
            page: 2,
            limit: 2,
        };
        const all = await model.read({ filter, options });
        assert.ok(all.docs);
    });
    it("La función para leer productos debe devolver un array de productos en la propiedad 'docs'", async () => {
        const all = await model.read({
            page: 2,
            limit: 3,
        });
        assert.strictEqual(Array.isArray(all.docs), true);
    });
    it("La función para actualizar un producto debe devolver un producto actualizado", async () => {
        const before = await model.readOne(id);
        const one = await model.update(id, { title: "NuevoNombre" });
        assert.strictEqual(before.title !== one.title, true);
    });
    it("La función para eliminar un producto debe efectivamente eliminar un producto", async () => {
        const one = await model.destroy(id);
        assert.strictEqual(typeof one, "object");
    });
});
