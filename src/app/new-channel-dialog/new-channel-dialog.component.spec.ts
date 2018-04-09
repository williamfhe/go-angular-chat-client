import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChannelDialogComponent } from './new-channel-dialog.component';

describe('NewChannelDialogComponent', () => {
  let component: NewChannelDialogComponent;
  let fixture: ComponentFixture<NewChannelDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewChannelDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewChannelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
