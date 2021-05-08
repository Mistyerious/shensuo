import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../../src';

export default class extends Command {
	public constructor() {
		super('ping', {
			aliases: ['ping', 'pong'],
		});
	}

	public exec(message: Message, args: unknown) {
		const embed = new MessageEmbed()
			.setColor('RED')
			.setDescription('**`Pong`**!')
			.setThumbnail(this.client?.user?.displayAvatarURL()!)
			.addFields([
				{
					name: '💟 WS',
					value: `\`${this.client?.ws.ping.toFixed(2)}\``,
				},
			]);

		return message.reply(embed);
	}
}
