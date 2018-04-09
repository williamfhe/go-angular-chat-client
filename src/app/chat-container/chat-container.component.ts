import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatSidenav } from '@angular/material';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { NewChannelDialogComponent } from '../new-channel-dialog/new-channel-dialog.component';
import { UsernameDialogComponent } from '../username-dialog/username-dialog.component';
import { Notification } from '../models/notification';
import { Message } from '../models/message';
import { Channel } from '../models/channel';
import { ChannelInfo } from '../models/channelInfo';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.css']
})
export class ChatContainerComponent implements OnInit, AfterViewInit {
  @ViewChild('chanSide') chanSide: MatSidenav;
  @ViewChild('userSide') userSide: MatSidenav;

  defaultChannel = 'HOME';

  channels: { [id: string]: Channel; } = {};

  channelsNames: string[] = [];

  currentChannel: Channel;
  socket$: WebSocketSubject<Notification>;
  username: string;

  websocketURL = 'ws://localhost:8080/ws';

  constructor(public dialog: MatDialog) {
    // this.socket = new WebSocket('ws://localhost:8080/ws');
    this.socket$ = WebSocketSubject.create(this.websocketURL);

    this.socket$.subscribe(
      (received) => this.receiveFromSocket(received),
      (err) => console.error(err),
    );
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (window.innerWidth < 732) {
        this.chanSide.close();
        this.chanSide.mode = 'over';
        this.userSide.close();
        this.userSide.mode = 'over';
      }
    });
    setTimeout(() => this.openUsernameDialog());
  }

  receiveFromSocket(notif: Notification) {
    // console.log('received:', notif);
    switch (notif.type) {
      case 'newMessage':
        this.handleNewMessage(<Message>notif.data);
        break;
      case 'joinChannel':
        this.addChannelUser(<Message>notif.data);
        break;
      case 'leaveChannel':
        this.removeChannelUser(<Message>notif.data);
        break;
      case 'channelInfo':
        this.setChannelInfo(<ChannelInfo>notif.data);
        break;
      default:
        console.log('Unknow notification type:', notif.type);
    }
  }

  changeChannel(i: number) {
    const channelName = this.channelsNames[i];
    this.currentChannel = this.channels[channelName];
  }

  sendMessage(input: any) {
    const textContent = input.value.trim();
    input.value = '';

    if (textContent === '' || this.currentChannel == null) { return; }

    const msg = {'type': 'message', 'user': this.username, 'channel': this.currentChannel.name, 'content': textContent};
    const notif = new Notification('newMessage', msg);

    this.sendJSON(notif);
    msg.type = 'selfMessage';
    this.handleNewMessage(<Message>msg);
  }



  openUsernameDialog() {
    const dialogRef = this.dialog.open(UsernameDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(newUsername => {
      if (newUsername === undefined) { return; }
      this.username = newUsername;
      const notification = { 'type': 'setUsername', 'data': { 'username': this.username} };
      this.sendJSON(<Notification>notification);
      this.joinChannel(this.defaultChannel);
    });
  }

  openNewChannelDialog() {
    const dialogRef = this.dialog.open(NewChannelDialogComponent);
    dialogRef.afterClosed().subscribe(channelName => {
      if (channelName === undefined || channelName.trim() === '') { return; }
      // Check if the channel isn't already opened
      if (!(Object.keys(this.channelsNames).includes(channelName))) {
        this.joinChannel(channelName);
      }
    });
  }

  leaveChannel(channelName: string) {
    const index = this.channelsNames.indexOf(channelName);
    this.channelsNames.splice(index, 1);
    delete this.channels[channelName];

    if (this.channelsNames.length > 0) {
      this.currentChannel = this.channels[this.channelsNames[0]];
    } else {
      this.currentChannel = null;
    }

    const data = {'channel': channelName, 'user': this.username };
    const notif = new Notification('leaveChannel', data);
    this.sendJSON(notif);
  }

  joinChannel(channelName: string) {
    const channel = new Channel(channelName);
    this.channels[channelName] = channel;
    this.channelsNames.push(channelName);
    this.currentChannel = channel;
    this.currentChannel.addUser(this.username);

    const data = {'channel': channelName, 'user': this.username };
    const notif = new Notification('joinChannel', data);
    this.sendJSON(notif);
  }

  scroll(msgZone: any) {
    msgZone.scrollTop = msgZone.scrollHeight;
  }

  handleNewMessage(message: Message) {
    this.currentChannel.addMessage(message);
  }

  addChannelUser(message: Message) {
    // console.log('addchanneluser', message);
    this.channels[message.channel].addUser(message.user);
  }

  removeChannelUser(message: Message) {
    // console.log('removeChannelUser', message);
    this.channels[message.channel].removeUser(message.user);
  }

  setChannelInfo(channelInfo: ChannelInfo) {
    this.channels[channelInfo.channel].setUsers(channelInfo.users);
  }

  sendJSON(notif: Notification) {
    const json = JSON.stringify(notif);
    // console.log('Sending:', json);
    this.socket$.next(<any>json);
  }

}
