import { Injectable } from '@angular/core';
import {
  catchError,
  forkJoin,
  map,
  mapTo,
  of,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Product } from '../models/Product.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products$ = new Subject<Product[]>();
  totalProducts$ = new Subject<number>();

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private usersService: UsersService
  ) {}

  getProducts(page: number = 0, pageSize: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    this.http
      .get<{ totalProducts: number; products: Product[] }>(
        'http://localhost:3000/api/product',
        { params }
      )
      .pipe(
        switchMap(({ totalProducts, products }) => {
          return forkJoin(
            products.map((product) => {
              return this.usersService.getUserById(product.userId).pipe(
                map((user) => {
                  product.user = user;
                  return product;
                })
              );
            })
          ).pipe(map((products) => ({ totalProducts, products })));
        }),
        tap(({ totalProducts, products }) => {
          this.totalProducts$.next(totalProducts);
          this.products$.next(products);
        }),
        catchError((error) => {
          console.error(error.error.message);
          return of([]);
        })
      )
      .subscribe();
  }

  getProductById(id: string) {
    return this.http
      .get<Product>('http://localhost:3000/api/product/' + id)
      .pipe(
        switchMap((product) => {
          return this.usersService.getUserById(product.userId).pipe(
            map((user) => {
              product.user = user;
              return product;
            })
          );
        }),
        catchError((error) => throwError(error.error.message))
      );
  }

  likeProduct(id: string, like: boolean) {
    return this.http
      .post<{ message: string }>(
        'http://localhost:3000/api/product/' + id + '/like',
        { userId: this.auth.getUserId(), like: like ? 1 : 0 }
      )
      .pipe(
        mapTo(like),
        catchError((error) => throwError(error.error.message))
      );
  }

  dislikeProduct(id: string, dislike: boolean) {
    return this.http
      .post<{ message: string }>(
        'http://localhost:3000/api/product/' + id + '/like',
        { userId: this.auth.getUserId(), like: dislike ? -1 : 0 }
      )
      .pipe(
        mapTo(dislike),
        catchError((error) => throwError(error.error.message))
      );
  }

  createProduct(product: Product, image: File) {
    const formData = new FormData();
    formData.append('product', JSON.stringify(product));
    formData.append('image', image);
    return this.http
      .post<{ message: string }>('http://localhost:3000/api/product', formData)
      .pipe(catchError((error) => throwError(error.error.message)));
  }

  modifyProduct(id: string, product: Product, image: string | File) {
    if (typeof image === 'string') {
      return this.http
        .put<{ message: string }>(
          'http://localhost:3000/api/product/' + id,
          product
        )
        .pipe(catchError((error) => throwError(error.error.message)));
    } else {
      const formData = new FormData();
      formData.append('product', JSON.stringify(product));
      formData.append('image', image);
      return this.http
        .put<{ message: string }>(
          'http://localhost:3000/api/product/' + id,
          formData
        )
        .pipe(catchError((error) => throwError(error.error.message)));
    }
  }

  deleteProduct(id: string) {
    return this.http
      .delete<{ message: string }>('http://localhost:3000/api/product/' + id)
      .pipe(catchError((error) => throwError(error.error.message)));
  }
}
