import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
    showFooter: boolean = true;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
      this.checkCurrentRoute();
  
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.checkCurrentRoute();
        }
      });
    }
  
    checkCurrentRoute() {
      const currentRoute = this.router.url;
      console.log('Current route:', currentRoute);
      this.showFooter = !['/character-creation'].includes(currentRoute);
      console.log('Show footer:', this.showFooter);
    }
}
