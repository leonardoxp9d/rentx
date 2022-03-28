/* to - para quem eu quero enviar o email
subject - o assunto
body - corpo/descrição */

interface IMailProvider {
  sendMail(to: string, subject: string, body: string): Promise<void>;
}

export { IMailProvider };
