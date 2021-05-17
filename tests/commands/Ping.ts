import { Message, MessageEmbed } from 'discord.js';
import { Command } from '../../src';

export default class extends Command {
	public constructor() {
		super('ping', {
			aliases: ['ping', 'pong'],
			userPermissions: ['ADMINISTRATOR']
		});
	}

	public exec(message: Message, args: unknown): void {
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

		message.reply(embed);
	}
}
