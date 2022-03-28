import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(email: string): Promise<void> {
    /* busca o usuario pelo email */
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User does not exists!");
    }
    /* aqui n quero gere um numero grande de um token criado com payload e sign, 
    so quero um numero que consiga ter um controle, para saber que o link
    do usuario vai fazer a senha e um link valido, pra isso utilizamos uuid 
    isso e bom até pra nossa url n ficar extensa  */
    const token = uuidV4();

    /* data de expiração do token, add 3h na hora atual */
    const expires_date = this.dateProvider.addHours(3);

    /* agora com esse "token", criamos como refresh_token, na tabela users_tokens,
    assim n precisamos criar um tabela so para senha, sendo que podemos utilizar essa do users_tokens 
    que e uma tabela de gerenciamento de tokens */
    await this.usersTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    });
  }
}

export { SendForgotPasswordMailUseCase };
