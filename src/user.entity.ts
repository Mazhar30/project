import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  Uid: number;

  @Column()
  Username: string;

  @Column()
  City: string;

  @ManyToOne(() => Users, { nullable: true })
  @JoinColumn({ name: 'Friend' })
  Friend: Users;
}
