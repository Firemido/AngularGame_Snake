import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements OnInit {

  //snake move emitter
  @Output() snakeDiraction = new EventEmitter<{ x: number, y: number }[]>();
  @Output() foodCoordinate = new EventEmitter<{ x: number, y: number }>();

  snake: { x: number, y: number }[] = [{ x: 5, y: 5 }]
  direction: string = 'right';
  food: { x: number, y: number } = { x: 10, y: 10 }; // Example food position
  speedRun = 150;

  ngOnInit() {
    this.moveSnakePeriodically();
  }

  moveSnakePeriodically() {
    console.log(this.speedRun);
    setInterval(() => {
      this.moveSnake();
      this.snakeDiraction.emit(this.snake);
      this.foodCoordinate.emit(this.food);
    }, this.speedRun); // Adjust the interval as needed

  }


  // to move snake
  moveSnake() {

    let head = { ...this.snake[0] };

    switch (this.direction) {
      case "right": head.x != 17 ? head.x += 1 : head.x = 0; break;
      case "left": head.x != 0 ? head.x -= 1 : head.x = 17; break;
      case "up": head.y != 0 ? head.y -= 1 : head.y = 11; break;
      case "down": head.y != 11 ? head.y += 1 : head.y = 0; break;
    }


    if (head.x == this.food.x && head.y == this.food.y) {
      this.snake.unshift(head);

      this.food.x = Math.floor(Math.random() * 17);  // Random integer between 0 and 18
      this.food.y = Math.floor(Math.random() * 10);  // Random integer between 0 and 11



    }
    else {
      this.snake.unshift(head);
      this.snake.pop()
    }
    const snakeSet = new Set<string>();
    let collisionDetected = false;
    let collisionIndex = -1;

    this.snake.forEach((part, index) => {
      const key = `${part.x},${part.y}`;
      if (snakeSet.has(key)) {
        // Collision detected
        collisionDetected = true;
        collisionIndex = index;
      } else {
        snakeSet.add(key);
      }

    });


    // Handle game over if collision is detected
    if (collisionDetected) {
      console.log("lose");

      // Emit a new size of the snake array
      this.snake = this.snake.slice(0, collisionIndex); // Trim snake array
    }

  }

  getLoseSize(size: any[]) {
    this.snake = size;
  }

  
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
  
    switch (key) {
      case 'arrowright':
      case 'd':
        if (this.direction !== 'left') {
          this.direction = 'right';
        }
        break;
      case 'arrowleft':
      case 'a':
        if (this.direction !== 'right') {
          this.direction = 'left';
        }
        break;
      case 'arrowup':
      case 'w':
        if (this.direction !== 'down') {
          this.direction = 'up';
        }
        break;
      case 'arrowdown':
      case 's':
        if (this.direction !== 'up') {
          this.direction = 'down';
        }
        break;
      default:
        // Handle other keys if needed
        break;
    }
  }
  

}
