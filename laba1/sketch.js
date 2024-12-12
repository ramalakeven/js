let flying_nlo = {
    x: 600,
    y: 400,
    width: 250,
    height: 100,
    color_1: '#AFF0F0',
    color_2: '#969696',
    
    
    draw_signal: function(){
        fill(255);
        for(let i = 0; i < 10; i++)
            circle(this.x - this.width/2 + i * 27, this.y, 10);
    },

    change_pos: function(direction){
        this.x += direction;
    },

    draw_fly: function(){
        fill(this.color_1);
        arc(this.x, this.y - this.height/2, this.width/2, this.height, PI, TWO_PI);
        fill(this.color_2);
        arc(this.x, this.y, this.width, this.height + 10, PI, TWO_PI);
        fill(50);
        arc(this.x, this.y, this.width, this.height/2, 0, PI);
        this.draw_signal();  
    },

    beam: function(){
        fill(255,255,100,150);
        
        beginShape();
        vertex(this.x - this.width/8, this.y + 10);
        vertex(this.x + this.width/8, this.y + 10);
        vertex(this.x + this.width/4, height - 100);
        vertex(this.x - this.width/4, height - 100);
        endShape();
    }
}
let cows = [];
let score = 0;

function Cow(x, y, direction)
{
    this.x = x;
    this.y = y;
    this.direction = direction;

    this.walk = function()
    {
        this.x += this.direction;
    }

    this.draw = function()
    {
        push();
        translate(this.x, this.y);
        if (this.direction > 0)
        {
            scale(-1, 1);
        }

        fill(255, 250, 250);
        rect(0, -10, 10, 5);
        
        rect(0, -5, 2, 5);
        rect(8, -5, 2, 5);

        rect(-4, -12, 4, 4);
        
        fill(0);
        rect(4, -9, 3, 3);
        rect(6, -10, 2, 2);

        pop();
    }
}

function CowManager()
{
    
    let countCows = 10;

    this.update = function()
    {
        
        while(cows.length < countCows)
        {
            cows.push(new Cow(random(0, width) , height - 100, random(-2, 2)));
        }

        for (let i = 0; i < cows.length; i++)
        {
            cows[i].walk();
            
            if (cows[i].x > width) {
                cows[i].x = width;
                cows[i].direction *= -1;
            } else if (cows[i].x < 0) {
                cows[i].x = 0;
                cows[i].direction *= -1;
            }

            if (cows[i].x > flying_nlo.x - flying_nlo.width/4 && 
                cows[i].x < flying_nlo.x + flying_nlo.width/4) {
                score++;
                cows[i].x = random(0, width);
               
            }
        }
    }

    this.draw = function()
    {
        for(let i = 0; i < cows.length; i++)
            cows[i].draw();
    }

    return this;
}

function setup() {
    createCanvas(1000, 1000);
    frameRate(20);
    noStroke();
}

function draw(){
    background(50,100, 80);

    let cowManager = new CowManager();
    cowManager.update();
    cowManager.draw();

    fill(0,50,0);
    rect(0, height - 100, width, 100);

    flying_nlo.draw_fly();
    flying_nlo.beam();

    if (keyIsDown(LEFT_ARROW))
        flying_nlo.change_pos(-4);
    if (keyIsDown(RIGHT_ARROW))
        flying_nlo.change_pos(4);
    
        textSize(32);
    fill(255);
    text("Score: " + score, 20, 960);

}
