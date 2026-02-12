import { CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column('decimal', { precision: 12, scale: 2 })
  totalAmount: string;

  @CreateDateColumn()
  createdAt: Date;
}
