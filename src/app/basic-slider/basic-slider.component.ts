import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Observable } from 'rxjs';
import { Product } from '../models/Product.model';
import { DarkModeService } from '../services/dark-mode.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-basic-slider',
  templateUrl: './basic-slider.component.html',
  styleUrls: ['./basic-slider.component.css'],
})
export class BasicSliderComponent implements OnInit {
  allProducts$!: Observable<Product[]>;
  products: any[] = [];
  loading!: boolean;
  labelElement!: HTMLElement | null;
  totalProducts!: number;
  selctedProduct!: Product;
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
        const aDate: any = new Date(a.dbDate);
        const bDate: any = new Date(b.dbDate);
        return Number(aDate) - Number(bDate);
      });

      this.labelElement = document.querySelector('.mdc-slider__value-indicator-text');
      if (this.labelElement) this.labelElement.innerText = this.products[0].dbDate;

      this.selctedProduct = this.products[0];
      this.totalProducts = this.products.length;
      this.loading = false;
    });
  }

  ngAfterViewInit() {
    this.sliderThumb.nativeElement.focus();
  }

  onSliderChange(event: any) {
    const value = event.target.value;
    this.selctedProduct = this.products[value];
    if (this.labelElement) this.labelElement.innerText = this.selctedProduct.dbDate;
  }

  checkSelected(id: string): boolean {
    if (id === this.selctedProduct._id) return true;
    return false;
    }
}
