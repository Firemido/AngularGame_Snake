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
  speedRun = 90;  
  moveInProgress = false;

  private audioContext!: AudioContext;
  private eatSoundBuffer: AudioBuffer | null = null;
  

  private eatSound!: HTMLAudioElement;


  ngOnInit() {
    this.moveSnakePeriodically();
    this.initAudio();


  }

  initAudio() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.loadSound();
    }
  }

  moveSnakePeriodically() {
    const move = () => {
      this.moveSnake();
      this.snakeDiraction.emit(this.snake);
      this.foodCoordinate.emit(this.food);
  
      // Schedule the next move
      setTimeout(move, this.speedRun);
    };
  
    // Start the movement
    move();
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
      this.generateFood();
      this.playEatSound();



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
    setTimeout(() => {
      this.moveInProgress = false; // Reset the flag after 1 second
    }, 90);
    if(this.moveInProgress)
    {
      return ;  
    }

    this.moveInProgress = true;
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
  

  generateFood() {
    let emptySpaces = this.getEmptyCells();
    const randomIndex = Math.floor(Math.random() * emptySpaces.length);
    this.food = emptySpaces[randomIndex];
  }

  // using map to reduce the time complexity of generating new food
  getEmptyCells(): { x: number, y: number }[] {
    const snakePositions = new Set(this.snake.map(pos => `${pos.x},${pos.y}`));
  

    return Array.from({ length: 18 * 12 }, (useless, i) => ({
      x: i % 18,
      y: Math.floor(i / 18)
    })).filter(pos => !snakePositions.has(`${pos.x},${pos.y}`));
  }

  // Advanced way to play the sounds files 
  async loadSound() {
    try {
      const response = await fetch('assets/Sounds/FoodSound.mp3');
      const arrayBuffer = await response.arrayBuffer();
      this.eatSoundBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  }

  playEatSound() {
    if (!this.audioContext) {
      this.initAudio();
    }
    if (this.eatSoundBuffer) {
      const source = this.audioContext.createBufferSource();
      source.buffer = this.eatSoundBuffer;
      source.connect(this.audioContext.destination);
      source.start(0);
    }
  }



}
