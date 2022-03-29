/* to - para quem eu quero enviar o email
subject - o assunto
variable - variaveis
path - caminho do nosso arquivo fogotPassword.hbs */

interface IMailProvider {
  sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string
  ): Promise<void>;
}

export { IMailProvider };
