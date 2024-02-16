import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-header1',
  templateUrl: './header1.component.html',
  styleUrl: './header1.component.css'
})
export class Header1Component implements OnInit {
  constructor(private router:Router){

  }


  ngOnInit(){
   
  }
  redirectToLogin(){
    this.router.navigate(['login'])
  }

  redirectToContact(){
    this.router.navigate(['contact']);
  }

}