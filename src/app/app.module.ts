import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SnakeComponent } from './Components/snake/snake.component';
import { MapComponent } from './Components/map/map.component';
import { GameComponent } from './Components/game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    SnakeComponent,
    MapComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
