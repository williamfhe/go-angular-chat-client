import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-username-dialog',
  templateUrl: './username-dialog.component.html',
  styleUrls: ['./username-dialog.component.css']
})
export class UsernameDialogComponent implements OnInit {
  @ViewChild('usernameInput') usernameInput;

  username = '';

  constructor(public dialogRef: MatDialogRef<UsernameDialogComponent>) {
  }


  ngOnInit() {
  }

  validate(): void {
    if (!this.usernameInput.valid || this.username === '') { return; }
    this.dialogRef.close(this.username);
  }
}

