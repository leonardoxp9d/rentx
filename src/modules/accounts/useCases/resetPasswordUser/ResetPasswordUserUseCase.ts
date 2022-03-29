import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordUserUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}
  async execute({ token, password }: IRequest): Promise<void> {
    /* verifica se existe o token na table users_tokens */
    const userToken = await this.usersTokensRepository.findByRefreshToken(
      token
    );

    if (!userToken) {
      throw new AppError("Token invalid!");
    }

    /* verifica se o token ta expirado 
    compareIfBefore- verifica se a tada de expiração do toke (userToken.expires_date)
    vem antes da data de atual (this.dateProvider.dateNow()) */
    if (
      this.dateProvider.compareIfBefore(
        userToken.expires_date,
        this.dateProvider.dateNow()
      )
    ) {
      throw new AppError("Token expired!");
    }

    /* pega os dados do usuario */
    const user = await this.usersRepository.findById(userToken.user_id);

    /* criptografamos a nova senha, e substituimos a antiga por ela */
    user.password = await hash(password, 8);

    /* salvamos esse usuario com a senha nova, no banco */
    await this.usersRepository.create(user);

    /* removemos esse token da table users_tokens, porque se o usuario 
    já utilizou esse token para fazer a operação, ela não deve poder utilizar novamente */
    await this.usersTokensRepository.deleteById(userToken.id);
  }
}

export { ResetPasswordUserUseCase };
