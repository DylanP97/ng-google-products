import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { UsersService } from '../../services/users.service';

import { catchError, combineLatest, map, Observable, of, tap } from 'rxjs';
import { Product } from '../../models/Product.model';
import { Router } from '@angular/router';
import { DarkModeService } from '../../services/dark-mode.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})

export class ProductListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  products$!: Observable<Product[]>;
  totalProducts$!: Observable<number>;
  totalProducts!: number;
  loading!: boolean;
  errorMsg!: string;
  pageSize = 10;
  pageSizeOptions = [3, 5, 10, this.totalProducts];
  currentPage = 0;

  constructor(
    private productService: ProductsService,
    private router: Router,
    public darkModeService: DarkModeService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.products$ = this.productService.products$.pipe(
      tap(() => {
        this.loading = false;
        this.errorMsg = '';
      }),
      catchError((error) => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
        return of([]);
      })
    );
    combineLatest([
      this.productService.totalProducts$,
      this.products$,
    ]).subscribe(([totalProducts, products]) => {
      this.totalProducts = totalProducts;
      this.pageSizeOptions.push(this.totalProducts);
      this.totalProducts$ = of(totalProducts);
    });
    this.productService.getProducts(this.currentPage, this.pageSize);
  }

  onClickProduct(id: string) {
    this.router.navigate(['product', id]);
  }

  onAddNew() {
    this.router.navigate(['/new-product']);
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.productService.getProducts(this.currentPage, this.pageSize);
  }
}
