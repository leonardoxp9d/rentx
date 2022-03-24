import { getRepository, Repository } from "typeorm";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  /** Método para criar o carro no banco */
  async create({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
    id,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications,
      id,
    });
    await this.repository.save(car);
    return car;
  }

  /** Método para procurar carro com a mesma placa no banco */
  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.repository.findOne({
      license_plate,
    });
    return car;
  }

  /** Método para listar carros, atraves da marca, nome, ou categoria */
  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    /** .createQueryBuilder("c")-
     * "c" -1º param - e um alias, nome que vamos utilizar nas nossas buscas
     * .where("available = :available", { available: true }); -
     * condição, no caso esperamos que nosso campo available seja true */
    const carsQuery = await this.repository
      .createQueryBuilder("c")
      .where("available = :available", { available: true });

    if (brand) {
      carsQuery.andWhere("brand = :brand", { brand });
    }

    if (name) {
      carsQuery.andWhere("name = :name", { name });
    }

    if (category_id) {
      carsQuery.andWhere("category_id = :category_id", { category_id });
    }

    /** carsQuery.getMany(); - método para rodar a query(queryBuilder)
     * para conseguir todos os objetos */
    const cars = await carsQuery.getMany();

    return cars;
  }

  /** retorna o carro com o id igual ao que foi mandado */
  async findById(id: string): Promise<Car> {
    const car = await this.repository.findOne(id);
    return car;
  }
}

export { CarsRepository };
