var dog,dogIMG, happyDog, happyDogIMG;
var database, food, foodStock ;
var fedTime, lastFed, foodObj;
function preload()
{
  dogIMG=loadImage("images/dogImg.png")
  happyDogIMG=loadImage("images/dogImg1.png")
  bedroom = loadImage("images/Bed Room.png")
  garden = loadImage("images/Garden.png")
  washroom = loadImage("images/Wash Room.png")
}

function setup() {
	database = firebase.database();
    createCanvas(1000,500);

    //First
    readState = database.ref('gameState')
    readState.on("value",function(data){
gameState = data.val();
    })
    
    foodObj=new Food();

    foodStock=database.ref('Food');
    foodStock.on("value",readStock);

    feed = createButton("Feed the dog");
    feed.position(700, 95);
    feed.mousePressed(feedDog)

    addFood=createButton("Add Food");
    addFood.position(800,95);
    addFood.mousePressed(addFoods);

    

    dog = createSprite(250,250,10,10);
    dog.addImage(dogIMG)
    dog.scale = 0.15;

} 

function draw() {  
  background(46,139,87);
  foodObj.display();

  textSize(25)
  fill("blue");

  fedTime = database.ref('FeedTime');
    fedTime.on("value", function(data){
     lastFed = data.val()
    })
 

  //Fifth 
  currentTime = hour();
  if(currentTime == (lastFed + 1)){
    update("Playing")
    foodObj.garden();
  }else if(currentTime == (lastFed + 2)){
    update("Sleeping")
    foodObj.bedroom()
  }else if(currentTime == (lastFed + 3) && currentTime <= (lastFed + 4)){
    update("Bathing")
    foodObj.washroom()
  } else {
    update("Hungry")
    foodObj.display()
  }


  //Second
  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }
  drawSprites();
}

function readStock(data){
  food = data.val()
  foodObj.updateFoodStock(food);
}
function feedDog(){
  dog.addImage(happyDogIMG);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function addFoods(){
  food++;
  database.ref('/').update({
    Food:food
  })
}
//Third

function update(state){
  database.ref('/').update({
    gameState : state
  })
}