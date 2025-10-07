import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { HomeComponent } from "home/home.component"
import {CreationComponent} from "./creation/creation.component";
import {StatisticsComponent} from "./statistics/statistics.component";
import { InscriptionComponent } from './inscription/inscription.component';
import { AuthGuard } from './services/auth.guard';
import {LoginComponent} from "./login/login.component";
import {MyportfolioComponent} from "./myportfolio/myportfolio.component";

const routes: Routes = [
  { path: "", component: HomeComponent},
  { path: "creation", component: CreationComponent},
  { path: "statistics", component: StatisticsComponent},
  { path: 'inscription', component: InscriptionComponent},
  { path: 'login', component: LoginComponent},
  { path: 'myportfolio', component: MyportfolioComponent},
  { path: '**', redirectTo: ''}
]
/* canActivate: [AuthGuard] */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
