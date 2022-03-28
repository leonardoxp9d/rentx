import { verify, sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import auth from "@config/auth";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<string> {
    /* recebemos as informações(email/sub|id) do token para: 
    verify - verfica se um token e realmente valido 
    1 param - token
    2 param - chave secreta 
    as IPayload; - define que espera como retorno um IPayload */
    const { email, sub } = verify(token, auth.secret_refresh_token) as IPayload;

    const user_id = sub;

    /* pega o refresh token, baseado no id do usuario e no token */
    const userToken =
      await this.usersTokensRepository.findByUserIdAndRefreshToken(
        user_id,
        token
      );

    if (!userToken) {
      throw new AppError("Refresh Token does not exists!");
    }

    /* remove o refresh_token que existe do banco */
    await this.usersTokensRepository.deleteById(userToken.id);

    /* cria um novo refresh_token */
    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: sub,
      expiresIn: auth.expires_in_refresh_token,
    });

    /* cacular o dia de expiração do refresh_token */
    const expires_date = this.dateProvider.addDays(
      auth.expires_refresh_token_days
    );

    /* salva o refresh_token no banco */
    await this.usersTokensRepository.create({
      expires_date,
      refresh_token,
      user_id,
    });

    return refresh_token;
  }
}

export { RefreshTokenUseCase };
