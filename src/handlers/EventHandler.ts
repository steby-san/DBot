import Ready from '@/events/Ready';
import MessageCreate from '@/events/MessageCreate';
import { Client } from 'discord.js';

interface Event {
  name: string;
  once?: boolean;
  execute(...args: any[]): void;
}

// Lưu trữ các events
const events: Event[] = [
  Ready(),
  MessageCreate()
];

// reg các event cho client
const EventHandler = (client: Client) => {
  events.forEach((event: Event) => {
    const { name, once, execute } = event;
    const eventCallback = (...args: any[]) => execute(...args);
    if (once) {
      client.once(name, eventCallback);
    } else {
      client.on(name, eventCallback);
    }
  });

  client.on('ready', () => {
    if (client.user) {
      console.log(`✅ ${client.user.tag} đã sẵn sàng hoạt động!`);
    } else {
      console.log(`✅ Client đã sẵn sàng!`);
    }
  });
}

export default EventHandler;
