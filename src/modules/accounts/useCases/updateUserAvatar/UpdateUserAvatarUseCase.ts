import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";

interface IRequest {
  user_id: string;
  avatar_file: string;
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  async execute({ user_id, avatar_file }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    /* deleta o avatar/foto antigo */
    if (user.avatar) {
      await this.storageProvider.delete(user.avatar, "avatar");
    }

    /* salva a nova foto de avatar, na pasta avatar */
    await this.storageProvider.save(avatar_file, "avatar");

    /* substitui a foto no objeto desse avatar */
    user.avatar = avatar_file;

    /* salva no banco essa alteração */
    await this.usersRepository.create(user);
  }
}

export { UpdateUserAvatarUseCase };
