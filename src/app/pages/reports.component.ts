import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration, ChartType } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface BillDetail {
  id: number;
  customerName: string;
  paymentMethod: string;
  itemName: string;
  itemCode: string;
  description: string;
  salesRate: number;
  gstPercentage: number;
  quantity: number;
  itemTotal: number;
  gstAmount: number;
  totalAmount: number;
  createdAt: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  template: `
    <div class="report-container mat-elevation-z2">
      <div class="filters">
        <div class="filter-row">
          <mat-form-field appearance="outline">
            <mat-label>Report Type</mat-label>
            <mat-select [(ngModel)]="selectedReport">
              <mat-option *ngFor="let type of reportTypes" [value]="type">{{ type }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>From Date</mat-label>
            <input matInput [matDatepicker]="fromPicker" [(ngModel)]="fromDate" />
            <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
            <mat-datepicker #fromPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>To Date</mat-label>
            <input matInput [matDatepicker]="toPicker" [(ngModel)]="toDate" />
            <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
            <mat-datepicker #toPicker></mat-datepicker>
          </mat-form-field>

          <button mat-raised-button color="primary" (click)="fetchReport()">
            <mat-icon>search</mat-icon> Search
          </button>

          <button mat-stroked-button color="accent" (click)="exportToPDF()">
            <mat-icon>picture_as_pdf</mat-icon> PDF
          </button>
        </div>
      </div>

   
      <div class="table-wrapper">
        <table mat-table [dataSource]="dataSource" class="mat-elevation-z8 report-table">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef> ID </th>
            <td mat-cell *matCellDef="let element"> {{ element.id }} </td>
          </ng-container>

          <ng-container matColumnDef="customerName">
            <th mat-header-cell *matHeaderCellDef> Customer </th>
            <td mat-cell *matCellDef="let element"> {{ element.customerName }} </td>
          </ng-container>

          <ng-container matColumnDef="itemName">
            <th mat-header-cell *matHeaderCellDef> Item </th>
            <td mat-cell *matCellDef="let element"> {{ element.itemName }} </td>
          </ng-container>

          <ng-container matColumnDef="paymentMethod">
            <th mat-header-cell *matHeaderCellDef> Payment </th>
            <td mat-cell *matCellDef="let element"> {{ element.paymentMethod }} </td>
          </ng-container>

          <ng-container matColumnDef="totalAmount">
            <th mat-header-cell *matHeaderCellDef> Total </th>
            <td mat-cell *matCellDef="let element"> ₹{{ element.totalAmount }} </td>
          </ng-container>

          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef> Date </th>
            <td mat-cell *matCellDef="let element"> {{ element.createdAt | date:'short' }} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .report-container {
      padding: 16px;
      background: #fff;
      border-radius: 8px;
    }
    .filters {
      margin-bottom: 16px;
    }
    .filter-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    .table-wrapper {
      overflow-x: auto;
      margin-top: 16px;
    }
    .report-table {
      width: 100%;
    }
    .chart-container {
      width: 100%;
      max-width: 800px;
      margin-top: 24px;
    }
  `]
})
export class ReportsComponent {
  selectedReport = 'Sales Summary';
  reportTypes = ['Sales Summary', 'Daily Billing', 'Tax Report'];
  fromDate: Date | null = null;
  toDate: Date | null = null;

  displayedColumns: string[] = ['id', 'customerName', 'itemName', 'paymentMethod', 'totalAmount', 'createdAt'];
  dataSource = new MatTableDataSource<BillDetail>();

  barChartType: ChartType = 'bar';
  barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Total Sales ₹' }
    ]
  };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.loadDummyData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchReport() {
    const filtered = this.allData.filter(item => {
      const date = new Date(item.createdAt);
      return (!this.fromDate || date >= this.fromDate) &&
             (!this.toDate || date <= this.toDate);
    });

    this.dataSource.data = filtered;
    this.updateChart(filtered);
  }

  exportToPDF() {
    const doc = new jsPDF();
    doc.text("Billing Report", 14, 14);
    autoTable(doc, {
      head: [['ID', 'Customer', 'Item', 'Payment', 'Total', 'Date']],
      body: this.dataSource.data.map(d => [
        d.id, d.customerName, d.itemName, d.paymentMethod,
        `₹${d.totalAmount}`, new Date(d.createdAt).toLocaleString()
      ])
    });
    doc.save('report.pdf');
  }

  private loadDummyData() {
    this.allData = [
      {
        id: 1,
        customerName: 'Kumar',
        paymentMethod: 'Cash',
        itemName: 'Veg Biryani',
        itemCode: 'VB101',
        description: 'Spicy Biryani',
        salesRate: 150,
        gstPercentage: 5,
        quantity: 2,
        itemTotal: 300,
        gstAmount: 15,
        totalAmount: 315,
        createdAt: '2025-05-16T12:00:00'
      },
      {
        id: 2,
        customerName: 'Anitha',
        paymentMethod: 'UPI',
        itemName: 'Paneer Tikka',
        itemCode: 'PT202',
        description: 'Tandoori Paneer',
        salesRate: 200,
        gstPercentage: 5,
        quantity: 1,
        itemTotal: 200,
        gstAmount: 10,
        totalAmount: 210,
        createdAt: '2025-05-16T13:00:00'
      },
      {
        id: 3,
        customerName: 'Ravi',
        paymentMethod: 'Card',
        itemName: 'Chicken 65',
        itemCode: 'C6501',
        description: 'Spicy Fried Chicken',
        salesRate: 180,
        gstPercentage: 5,
        quantity: 1,
        itemTotal: 180,
        gstAmount: 9,
        totalAmount: 189,
        createdAt: '2025-05-15T14:00:00'
      }
    ];
    this.dataSource.data = this.allData;
    this.updateChart(this.allData);
  }

  private allData: BillDetail[] = [];

  private updateChart(data: BillDetail[]) {
    const labels = data.map(d => d.customerName);
    const totals = data.map(d => d.totalAmount);

    this.barChartData.labels = labels;
    this.barChartData.datasets[0].data = totals;
  }
}
