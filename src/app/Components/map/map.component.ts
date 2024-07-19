import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {


  isModalOpen = false; // Track modal visibility
  constructor() {}

    map: any[] = [];
  food: any;
  snake: { x: number, y: number }[] = [];

  player: any = {
    name: "",
    score: 0
  };
  

  highestScore:any = 0;

  topPlayer : any 
  topScoresList: any[] = [];
  minions: any;

  @Output() newSize = new EventEmitter<{ x: number, y: number }[]>();

  ngOnInit() {
    this.topPlayer = this.topScoresList[0]?.name
    this.createMap();
  }

  createMap() {
    const rows = 12;
    const cols = 18;
    this.map = Array.from({ length: rows }, () => Array(cols).fill(0));
  }

  getFoodCoordinate(food: { x: number, y: number }) {
    this.food = food;
  }

  getSnakeDiraction(snake: { x: number, y: number }[]) {
    this.snake = snake;
    this.minions = this.snake.length
    this.createMap();

    if(this.minions > this.highestScore)
    {
      this.highestScore = this.minions;
    }

    snake.forEach((part) => {

      // Mark snake part on the map
      this.map[part.y][part.x] = 1;
    });

    // Mark food position on the map
    if (this.food) {
      this.map[this.food.y][this.food.x] = 2;
    }

  }


  isSnakeHead(x: number, y: number): boolean {
    const head = this.snake[0];
    return head && head.x === x && head.y === y;
  }


  saveScoreIntoDatabase(){

    this.player.score = this.highestScore;
    
    this.topScoresList.push(this.player);

    this.topPlayer = this.topScoresList[0]?.name

    this.isModalOpen = false

  }


  openModal()
  {
    this.isModalOpen = true;
    
  }
  


  closeModal()
  {
    this.isModalOpen = false
  }
  

  endSaveReset(){
    console.log(1);
    this.createMap();
  }



}
