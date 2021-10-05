import { PrimaryGeneratedColumn, ManyToMany, OneToMany, Entity } from "typeorm";
import { Message } from "./Message";

import { User } from "./User";

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany((type) => User, (user) => user.conversations)
  attendees: User[];

  @OneToMany((type) => Message, (message) => message.conversation)
  messages: Message[];
}
