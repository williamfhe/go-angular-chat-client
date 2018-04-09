import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-channel-dialog',
  templateUrl: './new-channel-dialog.component.html',
  styleUrls: ['./new-channel-dialog.component.css']
})
export class NewChannelDialogComponent implements OnInit {
  @ViewChild('newChannelInput') newChannelInput;

  channelName = '';

  constructor(public dialogRef: MatDialogRef<NewChannelDialogComponent>) { }

  ngOnInit() {
  }

  validate(): void {
    if (!this.newChannelInput.valid || this.channelName === '') { return; }
    this.dialogRef.close(this.channelName.toUpperCase());
  }

}
