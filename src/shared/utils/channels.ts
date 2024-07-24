import { SupportedChannels } from "../interfaces";
import { channels } from "../constants/channels";

export function getChannelURL(channel: SupportedChannels): string {
	return `${process.env.REACT_APP_SAAS_BASE_URL}/channels/${channel}`;
}

export function getChannelConfig(id: SupportedChannels) {
	return channels.find((channel) => channel.id === id);
}

export function getChannelByClassName(className: string) {
	return channels.find((channel) => channel.className === className);
}
