import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { ChatContainerComponent } from './chat-container/chat-container.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TruncateModule } from 'ng2-truncate';
import { UsernameDialogComponent } from './username-dialog/username-dialog.component';
import { FormsModule } from '@angular/forms';
import { NewChannelDialogComponent } from './new-channel-dialog/new-channel-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatContainerComponent,
    UsernameDialogComponent,
    NewChannelDialogComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    TruncateModule,
    FormsModule
  ],
  entryComponents: [UsernameDialogComponent, NewChannelDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
