import { Message } from './message';

export class Channel {
    users: string[] = [];
    messages: Message[] = [];

    constructor (public name: string) {}

    public setUsers(users: string[]) {
        this.users = users;
    }

    public addUser(user: string) {
        this.users.push(user);
        this.createUserJoinMessage(user);
    }

    public removeUser(user: string) {
        const index = this.users.indexOf(user);
        if (index > -1) {
            this.users.splice(index, 1);
        }
        this.createUserLeaveMessage(user);
    }

    public addMessage(message: Message) {
        this.messages.push(message);
    }

    private createUserJoinMessage(user: string) {
        const msg = new Message(
            'info',
            'Information',
            this.name,
            `@${user} has joined the Channel.`
        );
        this.addMessage(msg);
    }

    private createUserLeaveMessage(user: string) {
        const msg = new Message(
            'info',
            'Information',
            this.name,
            `@${user} has left the Channel.`
        );
        this.addMessage(msg);
    }

}
