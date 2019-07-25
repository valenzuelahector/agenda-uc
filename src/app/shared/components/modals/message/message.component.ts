import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  public title:string;
  public message:string;
  public type:string;

constructor(@Inject(MAT_DIALOG_DATA) public data: {title:string, message:string, type:string}){
  this.title = data.title;
  this.message = data.message;
  this.type = data.type;

}

  ngOnInit() {
  }

}
