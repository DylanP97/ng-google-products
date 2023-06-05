import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Observable } from 'rxjs';
import { Product } from '../../../models/Product.model';
import { DarkModeService } from '../../../services/dark-mode.service';
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

  startYear!: number;
  endYear!: number;
  selectedYear!: number;
  allYears: number[] = [];
  productYears: number[] = [];
  productYearIndices: number[] = [];

  labelElement!: HTMLElement | null;

  public datePipe: DatePipe = new DatePipe('en-US');

  @ViewChild('slider') slider!: ElementRef;
  @ViewChild('sliderThumb') sliderThumb!: ElementRef<HTMLInputElement>;

  constructor(
    private productService: ProductsService,
    public darkModeService: DarkModeService
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

      this.startYear = this.products[0].dbYear;
      this.endYear = this.products[this.products.length - 1].dbEndYear
        ? this.products[this.products.length - 1].dbEndYear
        : this.products[this.products.length - 1].dbYear;

      for (let year = this.startYear; year <= this.endYear; year++) {
        this.allYears.push(year);
      }

      this.products.forEach((product) => {
        if (product.dbYearsDuration) {
          product.dbYearsDuration.forEach((year: number) => {
            this.productYears.push(year);
          });
        }
      });

      this.productYearIndices = this.productYears.map((year) =>
        this.allYears.indexOf(year)
      );

      this.labelElement = document.querySelector(
        '.mdc-slider__value-indicator-text'
      );

      this.selectedYear = this.startYear;
      this.loading = false;
    });
  }

  ngAfterViewInit() {
    this.sliderThumb.nativeElement.focus();
  }

  onSliderChange(event: any) {
    this.selectedYear = Number(event.target.value);
  }
}
