import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/Product.model';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, EMPTY, map, Observable, of, shareReplay, switchMap, take, tap, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss'],
  providers: [DatePipe]
})
export class SingleProductComponent implements OnInit {

  loading!: boolean;
  product$!: Observable<Product>;
  userId!: string;
  likePending!: boolean;
  liked!: boolean;
  disliked!: boolean;
  errorMessage!: string;
  funColor1 = 'rgba(140,255,13,0.5802696078431373)';
  funColor2 = 'rgba(255,13,245,0.5802696078431373)';
  funColor3 = 'rgba(17,13,255,0.5802696078431373)';
  isAdmin$!: Observable<boolean>;

  constructor(
    private products: ProductsService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userId = this.auth.getUserId();
    this.isAdmin$ = this.auth.isAdmin$;
    this.loading = true;
    this.product$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => {
        return this.products.getProductById(id).pipe(
          tap(product => {
            this.loading = false;
            if (product.usersLiked.find(user => user === this.userId)) {
              this.liked = true;
            } else if (product.usersDisliked.find(user => user === this.userId)) {
              this.disliked = true;
            }
          })
        );
      }),
      catchError((error) => {
        this.loading = false;
        this.errorMessage = error.error.message;
        return throwError(error);
      })
    );
  }

  onLike() {
    if (this.disliked) {
      return;
    }
    this.likePending = true;
    this.product$.pipe(
      take(1),
      switchMap((product: Product) => this.products.likeProduct(product._id, !this.liked).pipe(
        tap(liked => {
          this.likePending = false;
          this.liked = liked;
        }),
        map(liked => ({ ...product, likes: liked ? product.likes + 1 : product.likes - 1 })),
        tap(product => this.product$ = of(product))
      )),
    ).subscribe();
  }

  onDislike() {
    if (this.liked) {
      return;
    }
    this.likePending = true;
    this.product$.pipe(
      take(1),
      switchMap((product: Product) => this.products.dislikeProduct(product._id, !this.disliked).pipe(
        tap(disliked => {
          this.likePending = false;
          this.disliked = disliked;
        }),
        map(disliked => ({ ...product, dislikes: disliked ? product.dislikes + 1 : product.dislikes - 1 })),
        tap(product => this.product$ = of(product))
      )),
    ).subscribe();
  }

  onBack() {
    this.router.navigate(['/products']);
  }

  onModify() {
    this.product$.pipe(
      take(1),
      tap(product => this.router.navigate(['/modify-product', product._id]))
    ).subscribe();
  }

  onDelete() {
    this.loading = true;
    this.product$.pipe(
      take(1),
      switchMap(product => this.products.deleteProduct(product._id)),
      tap(message => {
        console.log(message);
        this.loading = false;
        this.router.navigate(['/products']);
      }),
      catchError(error => {
        this.loading = false;
        this.errorMessage = error.message;
        console.error(error);
        return EMPTY;
      })
    ).subscribe();
  }
}
