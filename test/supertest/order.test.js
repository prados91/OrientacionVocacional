import "dotenv/config.js";
import { expect } from "chai";
import supertest from "supertest";
import dao from "../../src/data/index.factory.js";
const { orders, products } = dao;

const requester = supertest("http://localhost:" + process.env.PORT + "/api");

const model = products;
const dOrders = orders;

describe("Testeando SERVER API: USER (REGISTER/LOGIN/VERIFY/DELETE) + ORDER(CREATE/READ/UPDATE/DELETE)", () => {
    const user = {
        name: "SUPERTEST",
        lastName: "TESTING",
        email: "augusto@coder.com",
        password: "hola1234",
        role: "USER",
        verified: true,
    };
    const product = {
        title: "SUPERTEST",
        category: "TEST",
        price: 1,
        stock: 1,
    };
    let order = {};
    let token = {};
    it("Registro de un usuario correctamente", async function () {
        this.timeout(10000);
        const response = await requester.post("/sessions/register").send(user);
        const { _body } = response;
        expect(_body.statusCode).to.be.equals(201);
    });
    it("Inicio de sesión correctamente", async () => {
        const response = await requester.post("/sessions/login").send(user);
        const { statusCode, headers } = response;
        token.key = headers["set-cookie"][0].split("=")[0];
        token.value = headers["set-cookie"][0].split("=")[1];
        expect(statusCode).to.be.equals(200);
    });
    let uid;
    it("Verifico usuario", async () => {
        const response = await requester.get(`/users/?email=${user.email}`);
        const { statusCode, _body } = response;
        uid = _body.response.docs[0]._id;
        expect(statusCode).to.be.equals(200);
    });
    let pid;
    it("Creación de un producto correctamente", async () => {
        const one = await model.create(product);
        pid = one._id;
        expect(one).to.have.property("_id");
    });
    it("Lectura del producto creado", async () => {
        const one = await model.readOne(pid);
        expect(one).to.have.property("_id");
    });
    it("Creación de una orden correctamente", async () => {
        const data = {
            user_id: uid,
            product_id: pid,
            quantity: 50,
        };
        const one = await dOrders.create(data);
        order = one;
        expect(one).to.have.property("_id");
    });
    it("Eliminación de la orden creada", async () => {
        const one = await dOrders.destroy(order._id);
        expect(one).to.have.property("_id");
    });
    it("Eliminación del producto creado", async () => {
        const one = await model.destroy(pid);
        expect(one).to.have.property("_id");
    });
    it("Cerrado de sesión correctamente", async () => {
        const response = await requester.post("/sessions/signout").set("Cookie", [token.key + "=" + token.value]);
        const { statusCode } = response;
        expect(statusCode).to.be.equals(200);
    });
    it("Eliminación de un usuario correctamente", async () => {
        const response = await requester.delete("/users/" + uid);
        const { statusCode } = response;
        expect(statusCode).to.be.equals(200);
    });
});
