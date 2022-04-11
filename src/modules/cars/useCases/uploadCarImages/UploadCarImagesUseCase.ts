import { inject, injectable } from "tsyringe";

import { ICarsImagesRepository } from "@modules/cars/repositories/ICarsImagesRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject("CarsImagesRepository")
    private carsImagesRepository: ICarsImagesRepository,
    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  async execute({ car_id, images_name }: IRequest): Promise<void> {
    images_name.map(async (image) => {
      /** salva o endereço da imagem no banco */
      await this.carsImagesRepository.create(car_id, image);

      /** salva a imagem na pasta tmp local ou no s3 storage na amazon
       * depende do que tiver na variavel disk do arquivo .env */
      await this.storageProvider.save(image, "cars");
    });
  }
}

export { UploadCarImagesUseCase };
