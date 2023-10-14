import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Log {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    requestUrl: string;

    @Column()
    requestMethod: string;

    @Column({ nullable: true })
    userId: number;

    @CreateDateColumn()
    createdAt: Date;
}
