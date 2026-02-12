import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'CUSTOMER'],
    default: 'CUSTOMER',
  })
  role: 'ADMIN' | 'CUSTOMER';

  @Column({ default: 0 })
  cancelCount: number;
}
