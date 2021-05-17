import { Command, Event } from "../../src/";
import { Message } from "discord.js";


export default class CommandFinished extends Event<'commandFinished'> {
  constructor() {
    super('commandFinished', {
      emitter: 'commandHandler',
      event: 'commandFinished'
    });
  }

  async exec(_: Message, command: Command) {
    console.log(`${command.identifier} has just finished`)
  }
}