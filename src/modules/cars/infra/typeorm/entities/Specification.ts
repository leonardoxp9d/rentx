import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("specifications")
class Specification {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    // se não tiver valor no atributo id, então criamos com a função uuidV4()
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Specification };
