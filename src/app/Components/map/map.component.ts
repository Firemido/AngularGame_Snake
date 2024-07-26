import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {

  isLeaderboardOpen = false;
  isModalOpen = false; // Track modal visibility
  constructor(private firebaseService: FirebaseService) {}

    map: any[] = [];
  food: any;
  snake: { x: number, y: number }[] = [];

  player: any = {
    name: undefined,
  };
  

  highestScore:any = 0;

  topPlayer : any 
  topScoresList: any[] = [];
  minions: any;
  userSetion : any;

  @Output() newSize = new EventEmitter<{ x: number, y: number }[]>();

  ngOnInit() {

   this.userSetion = this.generateUserID();

    this.getData()

    this.createMap();
  }

  createMap() {
    const cols = 12;
    const rows = 18;

    
    this.map = Array.from({ length: cols }, () => Array.from({ length: rows }));
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

    for(let part of snake)
    {
      this.map[part.y][part.x] = 1;
    }


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
    
    this.addData(this.player.name);

    this.isModalOpen = false;
    
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




  async addData(name :string) {
    
    const newItem = { userCode:this.userSetion , name: name, score:this.highestScore  , timestamp: new Date() };

    const docId = await this.firebaseService.addDocument('leaderboard', newItem);
    console.log('Document added with ID:', docId);
    this.getData();
  }

  async getData() {

    this.topScoresList =[];
    const leaderboardData = await this.firebaseService.getDocuments('leaderboard');

    for(let entry of leaderboardData)
    {
      this.topScoresList.push(entry)
    }

    this.topScoresList.sort((a,b)=> a.score - b.score).reverse();

    this.topPlayer = this.topScoresList[0].name


  }

  generateUserID() : string {

    let  id = "";
    let charPool= "QWERTUIOP[]ASDFGHKL;'ZXCVBNM,./qwerttyuiopasddfghgjklzxcvbnm,./!@#$%^&*()_+1234567890-=";

    for(let i = 0 ; i < 10 ; i++){

      id= id.concat(charPool[Math.floor(Math.random() * charPool.length)])
    }
    
    return id 
  }

  openLeaderBoard(){
    console.log(1);
    this.isLeaderboardOpen = true;
  }
  closeLeaderboard() {
    this.isLeaderboardOpen = false;
  }
}
