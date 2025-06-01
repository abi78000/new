import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MenuItem {
  id?: number;
  itemCode: string;
  itemName: string;
  description: string;
  gstPercentage: number;
  mrp: number;
  salesRate: number;
  categoryId: number;
  isAvailable: boolean;
  imageBase64?: string;
  quantity: number;
  
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private baseUrl = 'https://pan-s30t.onrender.com/api/menuitems';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.baseUrl);
  }

  addMenuItem(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl, formData);
  }
}
