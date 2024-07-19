import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {



  constructor(private modalService: NgbModal) {}

  map: any[] = [];
  food: any;
  snake: { x: number, y: number }[] = [];

  highestScore:any = 0;

  topScoresList: any[] = [];
  minions: any;

  @Output() newSize = new EventEmitter<{ x: number, y: number }[]>();

  ngOnInit() {
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


  saveScoreIntoDatabase(content: any){
    console.log(this.highestScore)

    this.modalService.open(content);
  }


  endSaveReset(){
    console.log(1);
    this.createMap();
  }



}
