import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { SingleProductComponent } from './components/single-product/single-product.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from './services/auth-guard.service';
import { BasicSliderComponent } from './components/chronologies/basic-slider/basic-slider.component';
import { ChronologyRealTimeComponent } from './components/chronologies/chronology-realtime/chronology-realtime.component';
import { AdminGuard } from './services/admin-guard.service';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'product/:id', component: SingleProductComponent, canActivate: [AuthGuard] },
  { path: 'new-product', component: ProductFormComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: 'modify-product/:id', component: ProductFormComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'basic-chronology', component: BasicSliderComponent, canActivate: [AuthGuard] },
  { path: 'realtime-chronology', component: ChronologyRealTimeComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'products'},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, AdminGuard]
})
export class AppRoutingModule { }
