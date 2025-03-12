import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Landmark {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  type: string;

  @Column('float')
  lat: number;

  @Column('float')
  lng: number;

  @Column({ nullable: true })
  originalRequest: boolean;
}
