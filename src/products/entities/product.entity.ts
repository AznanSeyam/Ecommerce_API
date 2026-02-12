import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 12, scale: 2 })
  price: string; 

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ nullable: true })
  description?: string;
}
