import { Message } from 'discord.js';
import { Command } from '../../src';

export default class BlockClient extends Command {
  public constructor() {
    super('blockClient', {
      aliases: ['block'],
    });
  }

  public exec(message: Message, args: unknown): void {
    message.channel.send(`>>ping`)
  }
}
