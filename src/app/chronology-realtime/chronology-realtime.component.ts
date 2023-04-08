import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Observable } from 'rxjs';
import { Product } from '../models/Product.model';
import { DarkModeService } from '../services/dark-mode.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chronology-realtime',
  templateUrl: './chronology-realtime.component.html',
  styleUrls: ['./chronology-realtime.component.css'],
})
export class ChronologyRealTimeComponent implements OnInit {
  allProducts$!: Observable<Product[]>;
  products: any[] = [];
  loading!: boolean;
  startMonth!: string;
  endMonth!: string;
  selectedMonth!: string;
  allMonths: string[] = [];
  labelElement!: HTMLElement | null;
  productMonths: string[] = [];
  productMonthIndices: number[] = [];
  public datePipe: DatePipe = new DatePipe('en-US');

  @ViewChild('slider') slider!: ElementRef;
  @ViewChild('sliderThumb') sliderThumb!: ElementRef<HTMLInputElement>;

  constructor(
    private productService: ProductsService,
    public darkModeService: DarkModeService,
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.allProducts$ = this.productService.getAllProducts();
    this.allProducts$.subscribe((products) => {
      this.products = products.sort((a, b) => {
        const aYear: any = new Date(a.dbDate);
        const bYear: any = new Date(b.dbDate);
        return Number(aYear) - Number(bYear);
      });
      const start = new Date(this.products[0].dbDate);
      const end = new Date(
        this.products[this.products.length - 1].dbDate
      );

      for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
        const startMonth = year === start.getFullYear() ? start.getMonth() : 0;
        const endMonth = year === end.getFullYear() ? end.getMonth() : 11;

        for (let month = startMonth; month <= endMonth; month++) {
          this.allMonths.push(`${month + 1}/${year}`);
        }
      }

      this.products.forEach((product) => {
        const date = new Date(product.dbDate);
        const month = date.getMonth();
        const year = date.getFullYear();
        const monthYear = `${month + 1}/${year}`;
        this.productMonths.push(monthYear)
      });

      this.productMonthIndices = this.productMonths.map(month => this.allMonths.indexOf(month));

      this.labelElement = document.querySelector('.mdc-slider__value-indicator-text');
      if (this.labelElement) this.labelElement.innerText = this.allMonths[0];

      this.selectedMonth = '0';
      this.startMonth = '0';
      this.loading = false;
    });
  }

  ngAfterViewInit() {
    this.sliderThumb.nativeElement.focus();
  }

  onSliderChange(event: any) {
    this.selectedMonth = event.target.value;
    if (this.labelElement) this.labelElement.innerText = this.allMonths[event.target.value];
  }

  formatDBDate(dateInDB: string): string {
    const date = new Date(dateInDB);
    const year = date.getFullYear();
    const month = date.getMonth();
    const searchIndex = `${month + 1}/${year}`;
    const index = `${this.allMonths.indexOf(searchIndex)}`;
    return index;
  }


}
