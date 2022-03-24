/** middleware - garante que o ques está fazendo a requisição para uma determinada
 * rota, seja um usuario autenticado */

import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { UsersRepository } from "../../../../modules/accounts/infra/typeorm/repositories/UsersRepository";
import { AppError } from "../../../errors/AppError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  /** pega o token enviado */
  const authHeader = request.headers.authorization;

  /** verifica se o autHeader está preenchido */
  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }

  /** desestruturando o token, para pegar so o token
   * split - divide nossa informação, criando um array
   * [,toKen] - excluimos a posição 0(Beader) antes da "," e pegamos so o token */
  const [, token] = authHeader.split(" ");

  /** verify - verificamos se o token e valido
   * se de erro ele lança um excessão por isso
   * vamos utilizar try-catch */
  try {
    const { sub: user_id } = verify(
      token,
      "629154f7128dbc61abbdf5264038e57d"
    ) as IPayload;
    // vericar se o usuario existe no banco de dados
    const usersRepository = new UsersRepository();

    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User does not exists!", 401);
    }

    /** passando o id do user para o request
     * para assim recupear ele em outras horas */
    request.user = {
      id: user_id,
    };

    next();
  } catch {
    throw new AppError("Invalid token!", 401);
  }
}
