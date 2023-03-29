import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Observable } from 'rxjs';
import { Product } from '../models/Product.model';
import { DarkModeService } from '../services/dark-mode.service';
import { MatSlider } from '@angular/material/slider';

@Component({
  selector: 'app-chronology-slider',
  templateUrl: './chronology-slider.component.html',
  styleUrls: ['./chronology-slider.component.css']
})

export class ChronologySliderComponent implements OnInit {
  allProducts$!: Observable<Product[]>;
  products: any[] = [];
  loading!: boolean;
  startYear!: number;
  endYear!: number;
  selectedYear!: string;

  @ViewChild('slider') slider!: ElementRef;

  constructor(
    private productService: ProductsService,
    public darkModeService: DarkModeService,
    ) {}

  ngOnInit(): void {
    this.loading = true;
    this.allProducts$ = this.productService.getAllProducts();
    this.allProducts$.subscribe(products => {
      this.products = products.sort((a, b) => {
        const aYear = new Date(a.yearLaunched).getFullYear();
        const bYear = new Date(b.yearLaunched).getFullYear();
        return aYear - bYear;
      });
      this.startYear = new Date(this.products[0].yearLaunched).getFullYear();
      this.endYear = new Date(this.products[this.products.length - 1].yearLaunched).getFullYear();
      this.selectedYear = `${this.startYear}`;
      this.loading = false;
    });
  } 
  
  onSliderChange(event: any) {
    this.selectedYear = `${Number(event.target.value)}`;
  }


  formatDBDateToYear(dateInDB: string): string {
    const date = new Date(dateInDB);
    const year = date.getFullYear();
    return `${year}`;
  }


}
