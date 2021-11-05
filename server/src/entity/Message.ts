import {
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Entity,
  CreateDateColumn,
} from "typeorm";

import { Conversation } from "./Conversation";
import { User } from "./User";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne((type) => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;

  @ManyToOne((type) => User, (user) => user.messages)
  author: User;

  @CreateDateColumn()
  createdAt: Date;
}
