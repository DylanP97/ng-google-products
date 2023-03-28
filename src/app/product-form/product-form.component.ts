import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/Product.model';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  productForm!: FormGroup;
  mode!: string;
  loading!: boolean;
  product!: Product;
  errorMsg!: string;
  imagePreview!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private products: ProductsService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.route.params.pipe(
      switchMap(params => {
        if (!params['id']) {
          this.mode = 'new';
          this.initEmptyForm();
          this.loading = false;
          return EMPTY;
        } else {
          this.mode = 'edit';
          return this.products.getProductById(params['id'])
        }
      }),
      tap(product => {
        if (product) {
          this.product = product;
          this.initModifyForm(product);
          this.loading = false;
        }
      }),
      catchError(error => this.errorMsg = JSON.stringify(error))
    ).subscribe();
  }

  initEmptyForm() {
    this.productForm = this.formBuilder.group({
      name: [null, Validators.required],
      category: [null, Validators.required],
      description: [null, Validators.required],
      image: [null, Validators.required],
      website: [null, Validators.required],
      yearLaunched: [null, Validators.required],
    });
  }

  initModifyForm(product: Product) {
    this.productForm = this.formBuilder.group({
      name: [product.name, Validators.required],
      category: [product.category, Validators.required],
      description: [product.description, Validators.required],
      image: [product.imageUrl, Validators.required],
      website: [product.website, Validators.required],
      yearLaunched: [product.yearLaunched, Validators.required],
    });
    this.imagePreview = this.product.imageUrl;
  }

  onSubmit() {
    this.loading = true;
    const newProduct = new Product();
    newProduct.name = this.productForm.get('name')!.value;
    newProduct.category = this.productForm.get('category')!.value;
    newProduct.description = this.productForm.get('description')!.value;
    newProduct.website = this.productForm.get('website')!.value;
    newProduct.yearLaunched = this.productForm.get('yearLaunched')!.value;
    newProduct.userId = this.auth.getUserId();
    newProduct.username = this.auth.getUsername();
    
    if (this.mode === 'new') {
      this.products.createProduct(newProduct, this.productForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/products']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    } else if (this.mode === 'edit') {
      this.products.modifyProduct(this.product._id, newProduct, this.productForm.get('image')!.value).pipe(
        tap(({ message }) => {
          console.log(message);
          this.loading = false;
          this.router.navigate(['/products']);
        }),
        catchError(error => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
          return EMPTY;
        })
      ).subscribe();
    }
  }

  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.productForm.get('image')!.setValue(file);
    this.productForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
