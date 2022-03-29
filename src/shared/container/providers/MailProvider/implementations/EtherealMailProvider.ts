import fs from "fs";
import handlebars from "handlebars";
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

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void> {
    /* leitura dos arquivos 
    fs.readFileSync(path) - pega o arquivo
    toString - converte o arquivo para string como utf-8 */
    const templateFileContent = fs.readFileSync(path).toString("utf-8");

    /* handlebars.compile - compila/converte para uma forma que o handlebars entenda 
    templateParse - gera uma função, agora e uma função */
    const templateParse = handlebars.compile(templateFileContent);

    /** pegamos todas as variaveis e passamos para dentro do template "templateParse" */
    const templateHTML = templateParse(variables);

    /* from - de onde esta vindo a mensagem */
    const message = await this.client.sendMail({
      to,
      from: "Rentx <noreplay@rentx.com.br>",
      subject,
      html: templateHTML,
    });

    console.log("Message sent: %s", message.messageId);
    // mostra a url para verificar o que esta sendo enviado
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export { EtherealMailProvider };
