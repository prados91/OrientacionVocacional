import env from "./env.utils.js";
import { createTransport } from "nodemailer";
import __dirname from "../../utils.js";

async function recoveryEmail(data, token) {
    try {
        const recoveryLink = `${env.RECOVERY}${token}`;
        console.log(recoveryLink);
        const transport = createTransport({
            service: "gmail",
            port: env.PORT,
            auth: {
                user: env.GOOGLE_EMAIL,
                pass: env.GOOGLE_PASSWORD,
            },
        });

        await transport.sendMail({
            from: `CODER <${env.GOOGLE_EMAIL}>`,
            to: data.email,
            subject: `RECOVERY PASSWORD: ${data.name.toUpperCase()} `,
            html: `
                <!doctype html>
                <html lang="en">

                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <title>BasketStore Recovery</title>
                </head>

                <body>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
                        <tr>
                            <td>&nbsp;</td>
                            <td class="container">
                                <div class="content">
                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main">
                                        <tr>
                                            <td class="wrapper">
                                                <p>Hi ${data.name.toUpperCase()}</p>
                                                <p>Para recuperar su contraseña haga click en el siguiente enlace.</p>
                                                <a href=${recoveryLink}>RECOVERY</a>
                                            </td>
                                        </tr>
                                    </table>
                                    <div class="footer">
                                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                            <td class="content-block powered-by">
                                                Powered by <a>BasketStore <img src="cid:weblogo"
                                                        alt="Logo Ecommerce" class="img-fluid" style="max-width: 30px;"></a>
                                            </td>
                                        </table>
                                    </div>
                                </div>
                            </td>
                            <td>&nbsp;</td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
            attachments: [
                {
                    filename: "logoWeb.png",
                    path: __dirname + "/public/logoWeb.png",
                    cid: "weblogo",
                },
            ],
        });
    } catch (error) {
        throw error;
    }
}
export default recoveryEmail;
