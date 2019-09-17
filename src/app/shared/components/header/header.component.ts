import { Component, OnInit, HostListener } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public menu:string =  'closed';
  public submenuIdx:number = null;
  public headerFixed:boolean = false;

  constructor(
    public utils:UtilsService
  ) { }

  ngOnInit() {
    this.onScroll(null);
  }

  stMenu(stated){
    this.menu = stated;
    this.submenuIdx = null;
  }

  stSubMenu(idx){
    this.submenuIdx = idx
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    let wPos = window.scrollY;
    if (wPos > 186) {
      this.headerFixed =  true;
    } else {
      this.headerFixed = false;
    }
  }
}
