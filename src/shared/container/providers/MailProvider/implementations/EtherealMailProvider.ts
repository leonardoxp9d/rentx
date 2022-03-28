import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";

import { IMailProvider } from "../IMailProvider";

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  /* construtor responsavel por criar a conta/email 
  como n conseguimos utilizar async-await dentro de construtor
  vamos utilizar o .then(), que ele vai traser as informações da conta */
  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch((err) => console.error(err));
  }

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    /* from - de onde esta vindo a mensagem */
    const message = await this.client.sendMail({
      to,
      from: "Rentx <noreplay@rentx.com.br>",
      subject,
      text: body,
      html: body,
    });

    console.log("Message sent: %s", message.messageId);
    // mostra a url para verificar o que esta sendo enviado
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export { EtherealMailProvider };
