import { Command, Event } from "../../src/";
import { Message } from "discord.js";


export default class CommandStarted extends Event<'commandStarted'> {
  constructor() {
    super('commandStarted', {
      emitter: 'commandHandler',
      event: 'commandStarted'
    });
  }

  async exec(_: Message, command: Command) {
    console.log(`${command.identifier} has started`)
  }
}