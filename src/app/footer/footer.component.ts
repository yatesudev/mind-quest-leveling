import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

// Defines the FooterComponent with its metadata
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  // Boolean to track whether to show the footer
  showFooter: boolean = true;

  // Constructor for the dependencies of the FooterComponent
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  // Lifecycle hook called when the component initializes
  ngOnInit() {
    this.checkCurrentRoute(); // Check the current route on initialization

    // Subscribe to router events to detect navigation changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkCurrentRoute(); // Check the current route on navigation end
      }
    });
  }

  // Array of routes where the footer should be hidden
  disallowedRoutes = [
    '/character-creation',
    '/landingpage',
  ];

  // Method to check the current route and update showFooter accordingly
  checkCurrentRoute() {
    const currentRoute = this.router.url; // Get the current URL
    this.showFooter = !this.disallowedRoutes.includes(currentRoute); // Show or hide the footer based on the current route
  }
}