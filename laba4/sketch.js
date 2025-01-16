
let myChar;
let studentData;
let myBar;

function preload(){
	studentData = loadTable('students.csv', 'csv', 'header');
}
function setup() {
	createCanvas(800, 800);
	
	myBar = new Bar(10, 10, 700, 700);
	myBar.setupAxis(0, 50, 0, 60, 10, 5);
	let quiz = studentData.getColumn('quiz');
	let proj = studentData.getColumn('project');
	let exam = studentData.getColumn('exam');
	let mark = studentData.getColumn('finalMark');

	let sum_quiz = 0;
	let sum_proj = 0;
	let sum_exam = 0;
	let sum_mark = 0;

	for (var i = 0; i<quiz.length; i++){
		sum_quiz += parseInt(quiz[i], 10);
		sum_proj += parseInt(proj[i], 10);
		sum_exam += parseInt(exam[i], 10);
		sum_mark += parseInt(mark[i], 10);
	}
	var av_quiz = sum_quiz / quiz.length;
	var av_proj = sum_proj / quiz.length;
	var av_exam = sum_exam / quiz.length;
	var av_mark = sum_mark / quiz.length;
	
	let labels = ['quiz', 'project', 'exam', 'final mark'];
	let colors = ['red', 'blue', 'purple', 'green'];
	let data = [av_quiz, av_proj, av_exam, av_mark];

	myBar.addBars(data, labels, colors);
/*
 // Диаграмма гендера
      let genderBarY = myBar.y + myBar.height + 50;  // Position below the first chart dynamically
    genderBar = new Bar(10, genderBarY, 700, 300);  // Gender chart positioned below
    genderBar.setupAxis(0, 2, 0, 100, 1, 10);

    let genders = studentData.getColumn('gender');
    let maleCount = genders.filter(g => g.toLowerCase() === 'm').length;
    let femaleCount = genders.filter(g => g.toLowerCase() === 'f').length;

    let total = genders.length;
    let malePercentage = (maleCount / total) * 100;
    let femalePercentage = (femaleCount / total) * 100;

    let genderLabels = ['Male', 'Female'];
    let genderColors = ['blue', 'pink'];
    let genderData = [malePercentage, femalePercentage];

    genderBar.addBars(genderData, genderLabels, genderColors);
	*/
}

function draw() {
	noLoop();
}

//constructor to draw a scatter diagram
//the x and y coordinates set the canvas location and the width and height size
function Scatter(x, y, width, height) {
	//save parameter values as properties
	this.x = x;
	this.y = y;

	this.width = width;
	this.height = height;

	//setup the axis take smallest and largest possible values for the axis
	//also how far apart the scale should the ticks be for each axis.
	this.setupAxis = function(xMin, xMax, yMin, yMax, xTickSpacing, yTickSpacing) {
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;

		//set the drawing properties for the axis
		stroke(0);
		strokeWeight(1);
		fill(0);

		//we need some padding before the axis line for the ticks and labels
		//we can just set the padding for the xAxis -labled y as it relates to the
		//height of the diagram
		var yPadding = 15;
		//create a property for the height of the actual plot and it start y. not including
		//the padding
		this.plotHeight = this.height - yPadding;
		this.plotY = this.y;

		//the x padding is more tricky we don't know how wide the label is so
		//lets check each tick and find the widest
		var widestYTick = 0;
		for (var i = yMin; i <= yMax; i += yTickSpacing) {
			if (textWidth(i) > widestYTick) {
				widestYTick = textWidth(i);
			}
		}

		//set the x padding to be the widest label plus 5 for the tick
		var xPadding = widestYTick + 5;

		//create a width property and an x value for the plot without the padding
		this.plotWidth = this.width - xPadding;
		this.plotX = this.x + xPadding;

		//plot the x axis
		line(this.plotX, this.plotY + this.plotHeight, this.plotX + this.plotWidth,
			this.plotY + this.plotHeight);

		//plot the y axis
		line(this.plotX, this.plotY, this.plotX, this.plotY + this.plotHeight);


		//draw the x ticks
		//how far apart are the ticks on the screen
		var scaledXTickSpacing = map(xTickSpacing, 0, xMax, 0, this.plotWidth);
		var xTickValue = xMin;
		//align the text so it is in the centre of each tick
		textAlign(CENTER, TOP);
		//iterate through the ticks, draw the line and a label
		for (var i = this.plotX; i <= (this.plotX + this.plotWidth + 1); i +=
			scaledXTickSpacing) {
			line(i, this.plotY + this.plotHeight, i, this.plotY + this.plotHeight +
				yPadding * 0.66);
			text(xTickValue, i, this.plotY + this.plotHeight + yPadding * 0.66);
			xTickValue += xTickSpacing;
		}

		//draw the y ticks
		var scaledYTickSpacing = map(yTickSpacing, 0, yMax, 0, this.plotHeight);
		var yTickValue = yMax;
		textAlign(RIGHT, CENTER);
		for (var i = this.plotY; i < (this.plotY + this.plotHeight + 1); i +=
			scaledYTickSpacing) {
			line(this.plotX, i, this.plotX - 5, i);
			text(yTickValue, this.plotX - 5, i);
			yTickValue -= yTickSpacing;
		}
	};

	//Add a single data point to the diagram the x and y value set the location
	//and the colour and size the look of the point
	this.addDataPoint = function(xValue, yValue, size, colour) {
		//if the data point is in the correct range for the graph add a point

		if (xValue >= this.xMin && xValue <= this.xMax &&
			yValue >= this.yMin && yValue <= this.yMax) {
			//use map to scale the point to the right location on the axis
			var pointX = round(map(xValue, this.xMin, this.xMax, this.plotX,
				this.plotWidth + this.plotX));
			var pointY = round(map(yValue, this.yMin, this.yMax, this.plotHeight +
				this.plotY, this.plotY));

			//switch the colour and plot
			fill(colour);
			noStroke();
			ellipse(pointX, pointY, size);
		}
	};

	//add arrays of x and y datapoints
	this.addDataPoints = function(xValues, yValues, size, colour) {
		if (xValues.length == yValues.length) {
			for (var i = 0; i < xValues.length; i++) {
				this.addDataPoint(xValues[i], yValues[i], size, colour);
			}
		} else {
			console.log("Error: the data point arrays aren't the same length");
		}
	};

	//draw a line of best fit from arrays of x and y data values
	this.lineOfBestFit = function(xValues, yValues, colour) {
		//if the two data arrays are the same length use the least squares forumula to
		//work out the m (gradient) and b(intercept) values.
		if (xValues.length == yValues.length) {
			var sumX = 0;
			var sumY = 0;
			var sumXY = 0;
			var sumX2 = 0;
			for (var i = 0; i < xValues.length; i++) {
				sumX += parseFloat(xValues[i]);
				sumY += parseFloat(yValues[i]);
				sumXY += parseFloat(xValues[i]) * parseFloat(yValues[i]);
				sumX2 += parseFloat(xValues[i]) * parseFloat(xValues[i]);
			}

			var m = (xValues.length * sumXY - sumX * sumY) / (xValues.length * sumX2 -
				sumX * sumX);
			var b = (sumY - m * sumX) / xValues.length;
			console.log("y=" + m + "x+" + b);

			var scaleB = map(b, this.yMin, this.yMax, this.plotHeight +
				this.plotY, this.plotY);

			//if x is negative add plotY to the final param if positive take away
			if (m >= 0) {
				var endY = scaleB - (m * this.plotWidth) - this.plotY;
			} else {
				var endY = scaleB - (m * this.plotWidth) + this.plotY;
			}
			stroke(colour);
			line(this.plotX, scaleB, this.plotX + this.plotWidth, endY);
		} else {
			console.log("Error: the data point arrays aren't the same length");
		}
	};
}

function Chart(x, y, width, height) {
	//save parameter values as properties
	this.x = x;
	this.y = y;

	this.width = width;
	this.height = height;

	//setup the axis take smallest and largest possible values for the axis
	//also how far apart the scale should the ticks be for each axis.
	this.setupAxis = function(xMin, xMax, yMin, yMax, xTickSpacing, yTickSpacing) {
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;

		//set the drawing properties for the axis
		stroke(0);
		strokeWeight(1);
		fill(0);

		//we need some padding before the axis line for the ticks and labels
		//we can just set the padding for the xAxis -labled y as it relates to the
		//height of the diagram
		var yPadding = 15;
		//create a property for the height of the actual plot and it start y. not including
		//the padding
		this.plotHeight = this.height - yPadding;
		this.plotY = this.y;

		//the x padding is more tricky we don't know how wide the label is so
		//lets check each tick and find the widest
		var widestYTick = 0;
		for (var i = yMin; i <= yMax; i += yTickSpacing) {
			if (textWidth(i) > widestYTick) {
				widestYTick = textWidth(i);
			}
		}

		//set the x padding to be the widest label plus 5 for the tick
		var xPadding = widestYTick + 5;

		//create a width property and an x value for the plot without the padding
		this.plotWidth = this.width - xPadding;
		this.plotX = this.x + xPadding;

		//plot the x axis
		line(this.plotX, this.plotY + this.plotHeight, this.plotX + this.plotWidth,
			this.plotY + this.plotHeight);

		//plot the y axis
		line(this.plotX, this.plotY, this.plotX, this.plotY + this.plotHeight);


		//draw the x ticks
		//how far apart are the ticks on the screen
		var scaledXTickSpacing = map(xTickSpacing, 0, xMax, 0, this.plotWidth);
		var xTickValue = xMin;
		//align the text so it is in the centre of each tick
		textAlign(CENTER, TOP);
		//iterate through the ticks, draw the line and a label
		for (var i = this.plotX; i <= (this.plotX + this.plotWidth + 1); i +=
			scaledXTickSpacing) {
			line(i, this.plotY + this.plotHeight, i, this.plotY + this.plotHeight +
				yPadding * 0.66);
			text(xTickValue, i, this.plotY + this.plotHeight + yPadding * 0.66);
			xTickValue += xTickSpacing;
		}

		//draw the y ticks
		var scaledYTickSpacing = map(yTickSpacing, 0, yMax, 0, this.plotHeight);
		var yTickValue = yMax;
		textAlign(RIGHT, CENTER);
		for (var i = this.plotY; i < (this.plotY + this.plotHeight + 1); i +=
			scaledYTickSpacing) {
			line(this.plotX, i, this.plotX - 5, i);
			text(yTickValue, this.plotX - 5, i);
			yTickValue -= yTickSpacing;
		}
	};
	
	this.addDataPoint = function(xValue, yValue, size, colour) {
		//if the data point is in the correct range for the graph add a point

		if (xValue >= this.xMin && xValue <= this.xMax &&
			yValue >= this.yMin && yValue <= this.yMax) {
			//use map to scale the point to the right location on the axis
			var pointX = round(map(xValue, this.xMin, this.xMax, this.plotX,
				this.plotWidth + this.plotX));
			var pointY = round(map(yValue, this.yMin, this.yMax, this.plotHeight +
				this.plotY, this.plotY));

			//switch the colour and plot
			fill(colour);
			noStroke();
			ellipse(pointX, pointY, size);
		}
	};
	
	this.drawLines = function(xValues, yValues, size, colour){
		if (xValues.length == yValues.length) {
			for (var i = 0; i < xValues.length; i++) {
				this.addDataPoint(xValues[i], yValues[i], size, colour);
				if (i != 0)
				{
					stroke(colour);
					strokeWeight(size/2);
					let pointPrevX = round(map(xValues[i-1], this.xMin, this.xMax, this.plotX, this.plotWidth + this.plotX));
					let pointPrevY = round(map(yValues[i-1], this.yMin, this.yMax, this.plotHeight + this.plotY, this.plotY));
					
					let pointX = round(map(xValues[i], this.xMin, this.xMax, this.plotX, this.plotWidth + this.plotX));
					let pointY = round(map(yValues[i], this.yMin, this.yMax, this.plotHeight + this.plotY, this.plotY));
					line(pointPrevX, pointPrevY, pointX, pointY);
				}
			}
		} else {
			console.log("Error: the data point arrays aren't the same length");
		}
	}
}

function Bar(x,y, width, height){
		//save parameter values as properties
	this.x = x;
	this.y = y;

	this.width = width;
	this.height = height;

	//setup the axis take smallest and largest possible values for the axis
	//also how far apart the scale should the ticks be for each axis.
	this.setupAxis = function(xMin, xMax, yMin, yMax, xTickSpacing, yTickSpacing) {
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;

		//set the drawing properties for the axis
		stroke(0);
		strokeWeight(1);
		fill(0);

		//we need some padding before the axis line for the ticks and labels
		//we can just set the padding for the xAxis -labled y as it relates to the
		//height of the diagram
		var yPadding = 15;
		//create a property for the height of the actual plot and it start y. not including
		//the padding
		this.plotHeight = this.height - yPadding;
		this.plotY = this.y;

		//the x padding is more tricky we don't know how wide the label is so
		//lets check each tick and find the widest
		var widestYTick = 0;
		for (var i = yMin; i <= yMax; i += yTickSpacing) {
			if (textWidth(i) > widestYTick) {
				widestYTick = textWidth(i);
			}
		}

		//set the x padding to be the widest label plus 5 for the tick
		var xPadding = widestYTick + 5;

		//create a width property and an x value for the plot without the padding
		this.plotWidth = this.width - xPadding;
		this.plotX = this.x + xPadding;

		//plot the x axis
		line(this.plotX, this.plotY + this.plotHeight, this.plotX + this.plotWidth,
			this.plotY + this.plotHeight);

		//plot the y axis
		line(this.plotX, this.plotY, this.plotX, this.plotY + this.plotHeight);


		//draw the x ticks
		//how far apart are the ticks on the screen
		this.scaledXTickSpacing = map(xTickSpacing, 0, xMax, 0, this.plotWidth);
		var xTickValue = xMin;
		
		//align the text so it is in the centre of each tick
		textAlign(CENTER, TOP);
		//iterate through the ticks, draw the line and a label
		for (var i = this.plotX; i <= (this.plotX + this.plotWidth + 1); i +=
			this.scaledXTickSpacing) {
			line(i, this.plotY + this.plotHeight, i, this.plotY + this.plotHeight +
				yPadding * 0.66);
			
			text(xTickValue, i, this.plotY + this.plotHeight + yPadding * 0.66);
			xTickValue += xTickSpacing;
		}

		//draw the y ticks
		this.scaledYTickSpacing = map(yTickSpacing, 0, yMax, 0, this.plotHeight);
		var yTickValue = yMax;
		textAlign(RIGHT, CENTER);
		for (var i = this.plotY; i < (this.plotY + this.plotHeight + 1); i +=
			this.scaledYTickSpacing) {
			line(this.plotX, i, this.plotX - 5, i);
			text(yTickValue, this.plotX - 5, i);
			yTickValue -= yTickSpacing;
		}
	};
	
	this.addBars = function(data, labels, colors){
		for (var i = 0; i<data.length; i++){
			this.addBar(5+i*15, data[i], 5, colors[i], labels[i]);
		}
		
	};
	
	this.addBar = function(xValue, yValue, width, colour, label){
			if (xValue >= this.xMin && xValue <= this.xMax && yValue >= this.yMin && yValue <= this.yMax) {
				var pointX = round(map(xValue, this.xMin, this.xMax, this.plotX, this.plotWidth + this.plotX));
				var pointY = round(map(yValue, this.yMin, this.yMax, this.plotHeight + this.plotY, this.plotY));
				
				
				fill(colour);
				stroke(0);
				strokeWeight(5);
				rect(pointX - (width/2) * this.scaledXTickSpacing/10, pointY, width*this.scaledXTickSpacing/10, this.plotHeight-pointY+this.scaledYTickSpacing/8);
				noStroke();
				fill(0);
				textAlign(CENTER);
				text(label, pointX, this.plotHeight + 50);
			
			}
	};

}

	
			
			