import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '../../common/enums/user-role.enum';
import { UserStatus } from '../../common/enums/user-status.enum';

@Entity('usuario')
export class User {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  password_hash: string;

  @Column({
    name: 'rol_principal',
    type: 'enum',
    enum: UserRole,
    default: UserRole.USUARIO,
  })
  rol_principal: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVO,
  })
  estado: UserStatus;

  @Column({ type: 'char', length: 2 })
  pais: string;

  @Column({ name: 'riot_verificado', type: 'tinyint', default: 0 })
  riot_verificado: boolean;

  @Column({ name: 'riot_id', type: 'varchar', length: 100, nullable: true })
  riot_id: string | null;

  @CreateDateColumn({ name: 'fecha_registro', type: 'datetime' })
  fecha_registro: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
