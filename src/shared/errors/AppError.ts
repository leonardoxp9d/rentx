/** Classe responsavel por customizar nossos erros */

export class AppError {
  /** readonly - define que o atributo so será pra leitura */
  public readonly message: string;
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
