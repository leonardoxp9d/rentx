import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";

import { IUsersTokensRepository } from "../IUsersTokensRepository";

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  usersTokens: UserTokens[] = [];

  async create({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    /* instancia a classe */
    const userToken = new UserTokens();

    /* inserimos os dados dentro do userToken */
    Object.assign(userToken, {
      expires_date,
      refresh_token,
      user_id,
    });

    /* salva o objeto usertoken dentro do array userstokens */
    this.usersTokens.push(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    /* procura no array, o userToken que tenha o id do user e o refreshToken
    igual a algum item do array usersTokens */
    const userToken = this.usersTokens.find(
      (ut) => ut.user_id === user_id && ut.refresh_token && refresh_token
    );
    return userToken;
  }

  /* deleta o userToken */
  async deleteById(id: string): Promise<void> {
    const userToken = this.usersTokens.find((ut) => ut.id === id);
    this.usersTokens.splice(this.usersTokens.indexOf(userToken));
  }

  /* procura o refresh_token passado, no array usersTokens */
  async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
    const userToken = this.usersTokens.find(
      (ut) => ut.refresh_token === refresh_token
    );
    return userToken;
  }
}

export { UsersTokensRepositoryInMemory };
