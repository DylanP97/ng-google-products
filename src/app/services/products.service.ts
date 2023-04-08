import { Injectable } from '@angular/core';
import {
  catchError,
  map,
  mapTo,
  Observable,
  of,
  Subject,
  tap,
  throwError,
} from 'rxjs';
import { Product } from '../models/Product.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment.prod';

declare global {
  interface FormData {
    entries(): IterableIterator<[string, FormDataEntryValue]>;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  allProducts$ = new Subject<Product[]>();
  products$ = new Subject<Product[]>();
  totalProducts$ = new Subject<number>();

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  createProduct(product: Product, image: File) {
    const formData = new FormData();
    formData.append('product', JSON.stringify(product));
    formData.append('imageUrl', image);

    return this.http
      .post<{ message: string }>(`${environment.API_URL}/api/product`, formData)
      .pipe(catchError((error) => error));
  }

  modifyProduct(id: string, product: Product, image: any) {

    const formData = new FormData();
    formData.append('product', JSON.stringify(product));
    if (image) formData.append('imageUrl', image);

    for (const [key, value] of formData.entries()) {
    }
    return this.http
      .put<{ message: string }>(
        `${environment.API_URL}/api/product/` + id, formData
      )
      .pipe(catchError((error) => error.error));
  }

  deleteProduct(id: string) {
    return this.http
      .delete<{ message: string }>(`${environment.API_URL}/api/product/` + id)
      .pipe(catchError((error) => error.error.message));
  }

  getAllProducts(): Observable<Product[]> {
    return this.http
      .get<{ products: Product[] }>(`${environment.API_URL}/api/product/all`)
      .pipe(
        map((response) => response.products),
        tap((products) => console.log(products)),
        catchError((error) => {
          console.error(error.error.message);
          return of([]);
        })
      );
  }

  getProducts(page: number = 0, pageSize: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    this.http
      .get<{ totalProducts: number; products: Product[] }>(
        `${environment.API_URL}/api/product`,
        { params }
      )
      .pipe(
        map(({ totalProducts, products }) => ({ totalProducts, products })),
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
      .get<Product>(`${environment.API_URL}/api/product/` + id)
      .pipe(
        map((product) => {
          return product;
        }),
        catchError((error) => throwError(error.error.message))
      );
  }

  likeProduct(id: string, like: boolean) {
    return this.http
      .post<{ message: string }>(
        `${environment.API_URL}/api/product/` + id + '/like',
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
        `${environment.API_URL}/api/product/` + id + '/like',
        { userId: this.auth.getUserId(), like: dislike ? -1 : 0 }
      )
      .pipe(
        mapTo(dislike),
        catchError((error) => throwError(error.error.message))
      );
  }
}
