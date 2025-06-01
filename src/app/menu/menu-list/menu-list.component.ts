import { Component, OnInit } from '@angular/core';
import { MenuService, MenuItem } from '../menu.service';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatSlideToggleModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule, // ✅ Add this
    FormsModule,              // For ngModel to work
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
  
  ],
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
})
export class MenuListComponent implements OnInit {
  menuItems: MenuItem[] = [];
  filteredMenuItems: MenuItem[] = [];
  searchTerm = '';
  bills: MenuItem[][] = [[], [], [], []];
  activeBillIndex = 0;

  constructor(
    private menuService: MenuService,
    private sanitizer: DomSanitizer,
    private http: HttpClient // Inject HttpClient for API calls
  ) {}

  ngOnInit(): void {
    this.menuService.getAll().subscribe((data) => {
      this.menuItems = data;
    });
  }

  getActiveCartItems(): MenuItem[] {
    return this.bills[this.activeBillIndex];
  }

  sanitizeImage(base64: string | null | undefined): SafeUrl | null {
    if (!base64) return null;
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${base64}`);
  }

  get cartItems(): MenuItem[] {
    return this.bills[this.activeBillIndex];
  }

  toggleAvailability(item: MenuItem): void {
    item.isAvailable = !item.isAvailable;
  }

  addToCart(item: MenuItem): void {
    const cart = this.bills[this.activeBillIndex];
    const existingItem = cart.find(cartItem => cartItem.itemCode === item.itemCode);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const newItem = { ...item, quantity: 1 };
      cart.push(newItem);
    }
  }

  removeFromCart(item: MenuItem): void {
    const cart = this.bills[this.activeBillIndex];
    const index = cart.indexOf(item);
    if (index > -1) {
      cart.splice(index, 1);
    }
  }

  increaseQuantity(item: MenuItem): void {
    item.quantity += 1;
  }

  decreaseQuantity(item: MenuItem): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
    }
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.salesRate * item.quantity), 0);
  }

  switchBill(index: number): void {
    this.activeBillIndex = index;
  }

  // Checkout and save bill logic
  checkout(): void {
    const currentBill = this.cartItems.map(item => ({
      ItemName: item.itemName,
      ItemCode: item.itemCode,
      Description: item.description,
      SalesRate: item.salesRate,
      GstPercentage: item.gstPercentage,
      Quantity: item.quantity,
    }));

    const billRequest = {
      CustomerName: "Customer Name",  // Dynamically set this if needed
      PaymentMethod: "Cash",  // Dynamically set this if needed
      Items: currentBill,
    };

    // Send POST request to save the bill
    this.http.post('https://pan-s30t.onrender.com/api/bills/saveBill', billRequest).subscribe(
      (response: any) => {
        console.log('Bill saved successfully', response);
        alert('Bill saved successfully. Total Amount: ₹' + response.TotalAmount);
      },
      (error) => {
        console.error('Error saving bill', error);
        alert('Error saving bill');
      }
    );
  }

  filterMenu(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredMenuItems = this.menuItems.filter(item =>
      item.itemName.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.itemCode.toLowerCase().includes(term)
    );
  }
}
