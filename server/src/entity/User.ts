import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";

import { Conversation } from "./Conversation";
import { Message } from "./Message";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 32,
  })
  username: string;

  @Column({
    length: 60,
  })
  password: string;

  @ManyToMany((type) => Conversation, (conversation) => conversation.attendees)
  @JoinTable()
  conversations: Conversation[];

  @OneToMany((type) => Message, (message) => message.author)
  messages: Message[];
}
