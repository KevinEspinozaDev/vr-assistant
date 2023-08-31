import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AssistantComponent } from './assistant/assistant.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  {
    path: '', // Ruta raíz
    redirectTo: '/menu', // Redirige a la ruta del AppComponent
    pathMatch: 'full'
  },
  {
    path: 'menu', // Ruta para AppComponent
    component: MenuComponent
  },
  {
    path: 'assistant', // Ruta para AssistantComponent
    component: AssistantComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
