import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { CharacterCreationComponent } from './character-creation/character-creation.component';
import { ProfileComponent } from './profile/profile.component';
import { InventoryComponent } from './inventory/inventory.component'; 
import { LootboxComponent } from './lootbox/lootbox.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
  { path: 'character-creation', component: CharacterCreationComponent, canActivate: [authGuard] },
  {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
  {path: 'inventory', component: InventoryComponent, canActivate: [authGuard]},
  {path: 'lootbox', component: LootboxComponent, canActivate: [authGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
