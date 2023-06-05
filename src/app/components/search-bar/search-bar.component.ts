import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Product } from 'src/app/models/Product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  stateCtrl = new FormControl('');
  filteredProducts!: Observable<Product[]>;
  products$!: Observable<Product[]>;
  products: Product[] = [];  

  constructor(
    private productService: ProductsService,
  ) {
    this.products$ = this.productService.getAllProducts();
    this.products$.subscribe((products) => {
      this.products = products;
      this.filteredProducts = this.stateCtrl.valueChanges.pipe(
        startWith(''),
        map((product) => (product ? this._filterProducts(product) : this.products.slice()))
      );
    });
  }

  private _filterProducts(value: string): Product[] {
    const filterValue = value.toLowerCase();

    return this.products.filter((product) =>
      product.name.toLowerCase().includes(filterValue)
    );
  }
}
