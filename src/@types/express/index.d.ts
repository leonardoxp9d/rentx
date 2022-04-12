/** sob-escrever tipagem
 * vamos add no request, a propriedade
 * user para poder depois usar o id dela */

declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface Request {
    user: {
      id: string;
    };
  }
}
