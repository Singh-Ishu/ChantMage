const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');



canvas.width = 1024;
canvas.height = 576;
console.log(canvas);

const collisionsMap = []
for(let i = 0; i < collisions.length; i+=70){
    collisionsMap.push(collisions.slice(i, 70 + i));
}

const battleZonesMap = []
for(let i = 0; i < battleZonesData.length; i+=70){
    battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}

const boundaries = []
const offset = {
    x: -700,
    y: -150,
}

collisionsMap.forEach((row, i)=>{
    row.forEach((symbol, j)=>{
        if(symbol === 258)
            boundaries.push(
                new Boundary({
                    position:{
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height+ offset.y
                    }
                })
            )
    })
})

const battleZones = []

battleZonesMap.forEach((row, i)=>{
    row.forEach((symbol, j)=>{
        if(symbol === 258)
            battleZones.push(
                new Boundary({
                    position:{
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height+ offset.y
                    }
                })
            )
    })
})

const image = new Image();
image.src='./Assets/img/Map.png';

const playerDownImage = new Image()
playerDownImage.src = './Assets/img/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './Assets/img/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './Assets/img/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './Assets/img/playerRight.png'

const player = new Sprite({
  position: {
    x: canvas.width / 2 ,
    y: 150
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage
  }
})

const background = new Sprite({
    position:{
        x: offset.x,
        y: offset.y
    },
    image: image
});

const keys = {
    w:{pressed : false},
    a:{pressed : false},
    s:{pressed : false},
    d:{pressed : false},
}



const movables = [background, ...boundaries, ...battleZones]

function rectangularCollision({rectangle1, rectangle2}){
    return(
        rectangle1.position.x +rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

const battle ={
    initiated: false
}

function animate(){
    const animationId = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        if(
            rectangularCollision({rectangle1: player, rectangle2: boundary})
        )
        {
            console.log("Colliding")
        }
        boundary.draw();
    })

    battleZones.forEach(battleZone => {
        battleZone.draw()
    })

    player.draw();
    
    let moving = true;
    player.animate = false;
    const dist =5;
    if(battle.initiated)return

    if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            if (
              rectangularCollision({
                rectangle1: player,
                rectangle2: battleZone
              })
            ) {
                console.log("Battle Started")
                window.cancelAnimationFrame(animationId)
                battle.initiated = true;
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                      gsap.to('#overlappingDiv', {
                        opacity: 1,
                        duration: 0.4,
                        onComplete() {
                          // activate a new animation loop
                          
                          animateBattle()
                          gsap.to('#overlappingDiv', {
                            opacity: 0,
                            duration: 0.4
                          })
                        }
                      })
                    }
                })
                break
            }
          }
    }

    
    player.animate = false
    if(keys.w.pressed && lastKey === 'w'){
        player.animate = true
        player.image = player.sprites.up
  
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
              rectangularCollision({
                rectangle1: player,
                rectangle2: {
                  ...boundary,
                  position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 5
                  }
                }
              })
            ) {
              moving = false
              break
            }
          }
        
          
      
        if (moving){movables.forEach(movable => {movable.position.y += dist;})}
        keys.w.pressed = false;
    }
    else if(keys.a.pressed && lastKey === 'a'){
        player.animate = true
        player.image = player.sprites.left

           
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
              rectangularCollision({
                rectangle1: player,
                rectangle2: {
                  ...boundary,
                  position: {
                    x: boundary.position.x + 5,
                    y: boundary.position.y
                  }
                }
              })
            ) {
              moving = false
              break
            }
          }
      
        if(moving){movables.forEach(movable => {movable.position.x += dist;})}
        keys.a.pressed = false;
    }
    else if(keys.s.pressed && lastKey === 's'){
        player.animate = true
        player.image = player.sprites.down

      
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
              rectangularCollision({
                rectangle1: player,
                rectangle2: {
                  ...boundary,
                  position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 5
                  }
                }
              })
            ) {
              moving = false
              break
            }
          }     


        if(moving){movables.forEach(movable => {movable.position.y -= dist;})}
        keys.s.pressed = false;
    }
    else if(keys.d.pressed && lastKey === 'd'){
        player.animate = true
        player.image = player.sprites.right
        
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
              rectangularCollision({
                rectangle1: player,
                rectangle2: {
                  ...boundary,
                  position: {
                    x: boundary.position.x + 5,
                    y: boundary.position.y
                  }
                }
              })
            ) {
              moving = false
              break
            }
          }

        if(moving){movables.forEach(movable => {movable.position.x -= dist;})}
        keys.d.pressed = false;
    }
}
animate()

const battleBackgroundImage = new Image()
battleBackgroundImage.src =  './Assets/img/battleBackground.png';
const battleBackground = new Sprite({position: {
    x: 0,
    y: 0
    },
    image: battleBackgroundImage})

const draggleImage = new Image()
draggleImage.src =  './Assets/img/draggleSprite.png';
const draggle = new Sprite({
    position: {
        x: 800,
        y: 100
    },
    image: draggleImage,
    frames:{
        max: 4,
        hold: 30
    },
    animate: true
})

const embyImage = new Image()
embyImage.src =  './Assets/img/playerUp.png';
const emby = new Sprite({
    position: {
        x: 280,
        y: 325
    },
    image: embyImage,
    frames:{
        max: 4,
        hold: 30
    },
    animate: false
})

function animateBattle(){
    window.requestAnimationFrame(animateBattle);
    console.log("Animating the battle");
    battleBackground.draw();
    draggle.draw()
    emby.draw()
}

let lastKey = ' '
window.addEventListener('keydown', (e)=>{
    switch(e.key){
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
})