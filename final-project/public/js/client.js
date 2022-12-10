//***************************************************************//
//                         Client side                           //
//***************************************************************//

let artists = [];
let wordsAndFrequencies = [];
let sentimentColorsR = [144, 45,  155, 239, 249, 249];
let sentimentColorsG = [190, 156, 81,  93,  153, 199];
let sentimentColorsB = [109, 219, 224, 168, 74, 79];
let r = [];   // Radius of star
let x = [];   // X position of star
let y = [];   // Y position of star
let viewX = 0;
let viewY = 0;
let pressedViewX = 0;
let pressedViewY = 0;
let pressedMouseX = 0;
let pressedMouseY = 0;

let viewZoom = 1;

let artistsPerRow = 6;
let radiusRatio = 0.1;
let wordRatio = 1;


function randomizeArray(array) {
  let len = array.length;
  for (source = 0; source < len; source++) {
    target = Math.floor(Math.random() * len);
    if (source != target) {
      let source_value = array[source];
      array[source] = array[target];
      array[target] = source_value;
    }
  }
  return array;
}

function normalizeArray(array) {
  let len = array.length;
  sumOfFrequences = 0;

  // Compute the sum of all frequencies.
  for (index = 0; index < len; index++) {
    sumOfFrequences += array[index].frequency;
  }
  avgFrequence = sumOfFrequences / len;

  // Normalize frequencies so that a value for the average frequence is 25.
  for (index = 0; index < len; index++) {
    array[index].frequency = 45 * array[index].frequency / avgFrequence;
  }
  return array;
}

/* Associate a color to a word depending on its sentimental value*/
function getSentimentIndex(score) {
  if (score < -0.6)
    return 0;
  else if (score < -0.3)
    return 1;
  else if (score < 0)
    return 2;
  else if (score < 0.3)
    return 3;
  else if (score < 0.6)
    return 4;
  else 
    return 5;
}

function displayStar(xCenter, yCenter, radius, artist, wordsAndFrequenciesArray) {
  let numOfWords = wordsAndFrequenciesArray.length;
  let lastAngle = 0;

  // First step: display arcs.
  for (word = 0; word < numOfWords; word++) {
    let index = getSentimentIndex(wordsAndFrequenciesArray[word].sentiment);
    fill(sentimentColorsR[index], sentimentColorsG[index], sentimentColorsB[index]);
  	stroke("100");
    strokeWeight(1);
    let angle = ((Math.PI * 2) / numOfWords) * (word + 1);
    let arcRadius = radius * (wordsAndFrequenciesArray[word].frequency / 10);
    arc(xCenter, yCenter, arcRadius, arcRadius, lastAngle, angle, PIE);

    // Prepare next angle.
    lastAngle = angle;
  }

  // Second step: display words.
  lastAngle = 0;
  for (word = 0; word < numOfWords; word++) {
    let angle = ((Math.PI * 2) / numOfWords) * (word + 1);
    let arcRadius = radius * (wordsAndFrequenciesArray[word].frequency / 10);
    fill(50);
    noStroke();
  	//stroke("Blue");
    textFont('IBM Plex Sans JP');
    textSize(0.10 * arcRadius);
    textAlign(CENTER, CENTER);
    let textRadius = arcRadius * 0.6;
    text(wordsAndFrequenciesArray[word].word, xCenter + textRadius * Math.cos((angle + lastAngle) / 2), yCenter + textRadius * Math.sin((angle + lastAngle) / 2));
    lastAngle = angle;
  }

  // Third step: display name of the artist.
  // fill('rgba(144, 190, 109, 0.25)');
  // rect(xCenter - 30, yCenter + 45, 95, 25);
  rectMode(RADIUS);
  fill('rgba(144, 190, 109, 0.25)');
  rect(xCenter, yCenter + 55, 65, 15);
  fill(50);
  noStroke();
  textFont('IBM Plex Sans JP');
  textSize(15);
  textAlign(CENTER, BOTTOM);
  text(artist, xCenter, yCenter + radius * 4);

}

function draw() {
  background(245, 255, 237);
  translate(viewX, viewY);
  scale(viewZoom)
  let index;
  for (index = 0; index < artists.length; index++)
    displayStar(x[index], y[index], r[index], artists[index], wordsAndFrequencies[index]);
}

function mouseWheel(e) {
  const {x, y, wheelDeltaY} = e;
  const direction =  wheelDeltaY > 0 ? 1 : -1;
  const zoomValue = 0.05 * direction;

  const wx = (x - viewX) / (width * viewZoom);
  const wy = (y - viewY) / (height * viewZoom);
  
  viewX -= wx * width * zoomValue;
  viewY -= wy * height * zoomValue;
  viewZoom += zoomValue;
}

function mousePressed() {
  pressedViewX = viewX;
  pressedViewY = viewY;
  pressedMouseX = mouseX;
  pressedMouseY = mouseY;
}

function mouseDragged() {
  viewX = pressedViewX + (mouseX - pressedMouseX);
  viewY = pressedViewY + (mouseY - pressedMouseY);
}

function mouseReleased() {
  pressedViewX = 0;
  pressedViewY = 0;
  pressedMouseX = 0;
  pressedMouseY = 0;
}


function setup() {
  console.log("setup");

  // Get data: artists with their associated collections of most frequent words.
  const myRequest = new Request('/data'); // data = artists_words_collection
  fetch(myRequest)
    .then((response) => response.json())
    .then((artists_words_collection) => {

      for (const artist_words of artists_words_collection) {
        artists.push(artist_words.artist);
        let normalizedWordsAndFrequenciesArray = normalizeArray(artist_words.wordsAndFrequencies);
        let wordsAndFrequenciesArray = randomizeArray(normalizedWordsAndFrequenciesArray);
        wordsAndFrequencies.push(wordsAndFrequenciesArray);
      } 
    setupPositions();
    })
    .catch(console.error);
    createCanvas(windowWidth, windowHeight);
}

/* Place the stars on the canvas */
function setupPositions() {
  let row = 0;
  let col = 0;
  let offset =0;
  let artistsPerCol = Math.floor(artists.length / artistsPerRow + 1);
  let rowHeight = Math.floor(windowHeight / artistsPerCol);
  let colWidth = Math.floor(windowWidth / (artistsPerRow + 0.5));
  for (index = 0; index < artists.length; index++) {
    row = Math.floor(index / artistsPerRow);
    col = index - row * artistsPerRow;
    r.push(Math.min(rowHeight, colWidth) * radiusRatio);
    if (row % 2 == 0)  
      offset = 0;// Artists on even rows have no X offset.
    else
      offset = colWidth / 2; // Artists on odd rows have a X offset.
    x.push(col * colWidth + colWidth / 2 + offset);
    y.push(row * rowHeight + rowHeight / 2);
  }
}