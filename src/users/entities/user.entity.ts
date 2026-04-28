import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Animal } from '../../animals/entities/animal.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => Animal, (animal) => animal.registeredBy)
  registeredAnimals: Animal[];

  @ManyToMany(() => Animal, (animal) => animal.interestedUsers)
  @JoinTable({ name: 'user_animal_favorites' })
  favorites: Animal[];

  @CreateDateColumn()
  createdAt: Date;
}
