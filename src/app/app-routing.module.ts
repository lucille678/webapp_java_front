import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { HomeComponent } from "home/home.component"
import {CreationComponent} from "./creation/creation.component";
import {StatisticsComponent} from "./statistics/statistics.component";
import { InscriptionComponent } from './inscription/inscription.component';
import { AuthGuard } from './services/auth.guard';
import {ConnexionComponent} from "./connexion/connexion.component";

const routes: Routes = [
  { path: "", component: HomeComponent , canActivate: [AuthGuard] },

  { path: "creation", component: CreationComponent, canActivate: [AuthGuard]},
  { path: "statistics", component: StatisticsComponent, canActivate: [AuthGuard]},
  { path: 'inscription', component: InscriptionComponent},
  { path: 'login', component: ConnexionComponent},
  { path: '**', redirectTo: ''}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
