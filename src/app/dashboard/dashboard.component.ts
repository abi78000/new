import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// Angular Material Modules
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatSidenavModule } from '@angular/material/sidenav';

import { MatTabsModule } from '@angular/material/tabs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
@Component({
 selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
        MatListModule,
       MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    MatDividerModule,
   MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
      MatExpansionModule  // Add this module to the imports array
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']

  
})

export class DashboardComponent {
    isMenuExpanded = false;
 // Define the orders property
  orders: any[] = [
    { id: 1, customer: 'John Doe', total: 25.50, status: 'Pending' },
    { id: 2, customer: 'Jane Smith', total: 42.75, status: 'Completed' },
    // Add more orders as needed
  ];
    // Toggle the value of isMenuExpanded
  toggleMenu() {
    this.isMenuExpanded = !this.isMenuExpanded;
  }

  

}
