import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Observable } from 'rxjs';
import { Product } from '../models/Product.model';
import { DarkModeService } from '../services/dark-mode.service';

@Component({
  selector: 'app-chronology-slider',
  templateUrl: './chronology-slider.component.html',
  styleUrls: ['./chronology-slider.component.css']
})
export class ChronologySliderComponent implements OnInit {
  allProducts$!: Observable<Product[]>;
  products: any[] = [];
  loading!: boolean;
  sliderPosition = 0;
  sliderWidth = 0;
  thumbWidth = 20; // add thumb width
  isDragging = false;
  currentX!: number;

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
      this.loading = false;
    });
  }

  ngAfterViewInit(): void {
    this.sliderWidth = this.slider.nativeElement.offsetWidth - this.thumbWidth; // subtract thumb width
  }

  getSliderPosition(dateString: string): number {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const startDate = this.products[0].yearLaunched;
    const startNewDate = new Date(startDate)
    const startYear = startNewDate.getFullYear()
    const endDate = this.products[this.products.length - 1].yearLaunched;
    const endNewDate = new Date(endDate)
    const endYear = endNewDate.getFullYear()

    console.log("year : " + year)

    const maxSliderPosition = 100

    const position = (maxSliderPosition * (year - startYear)) / (endYear - startYear)
    console.log("position : " + position)

    return position;
  }
  
  
  getTimestamp(dateString: string): number {
    const date = new Date(dateString);
    return date.getTime();
  }

  // onMouseDown(event: MouseEvent) {
  //   event.preventDefault();
  //   this.isDragging = true;
  //   this.currentX = event.clientX;
  //   this.slider.nativeElement.classList.add('active');
  //   this.slider.nativeElement.addEventListener('mousemove', this.onMouseMove.bind(this));
  //   this.slider.nativeElement.addEventListener('mouseup', this.onMouseUp.bind(this));
  // }
  
  // onMouseMove(event: MouseEvent) {
  //   if (this.isDragging) {
  //     const deltaX = event.clientX - this.currentX;
  //     this.sliderPosition += deltaX / this.slider.nativeElement.offsetWidth * 100;
  //     this.sliderPosition = Math.min(Math.max(this.sliderPosition, 0), 100);
  //     this.currentX = event.clientX;
  //   }
  // }
  
  // onMouseUp() {
  //   this.isDragging = false;
  //   this.slider.nativeElement.classList.remove('active');
  //   this.slider.nativeElement.removeEventListener('mousemove', this.onMouseMove.bind(this));
  //   this.slider.nativeElement.removeEventListener('mouseup', this.onMouseUp.bind(this));
  // }
  

}
