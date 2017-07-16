// Basic application setup

var isTouch = 'ontouchstart' in window;
var touchstart = 'mousedown';
var touchend = 'mouseup';
var touchmove = 'mousemove';

if (isTouch) {
    touchstart = 'touchstart';
    touchend = 'touchend';
    touchmove = 'touchmove';
}

// Prevent scrolling of main window
$(document).on(touchmove, function(e) {
    e.preventDefault();
});



// an array for the nodes
var nodes = new Array(40);
// an array for the springs
var springs = [];

// dragged node
var selectedNode = undefined;
var selectedZ = 0;
var rolloverNode = undefined;

var nodeDiameter = 7;

var zoom = 1;
var offset;
var factor = 1.5;

var clickPos = undefined;

var trackpads = [];

var samples = [];

var uMVMatrix, uPMatrix;


function preload() {
    for (var i = 0; i < 24; i++) {
        samples.push(loadSound('assets/PatchArena_marimba-0' + (60 + i) + ".wav"));
    }
}

/*function setup() {
  mySound.setVolume(0.1);
  mySound.play();
}*/

function setup() {
    createCanvas(windowWidth - 40, windowWidth - 40, WEBGL);

    noStroke();

    offset = createVector(width / 2, height / 2);
    uMVMatrix = this._renderer.uMVMatrix.copy();
    uPMatrix = this._renderer.uPMatrix.copy();

    initNodesAndSprings();

    createTrackpads();
    updateLayout();

    for (var i = 0; i < 12; i++) {
        samples[i].setVolume(0.1);
    }

}


function draw() {
    background(255);


    // let all nodes repel each other
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].attract(nodes);
    }
    // apply spring forces
    for (var i = 0; i < springs.length; i++) {
        springs[i].update();
    }
    // apply velocity vector and update position
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].update();
    }

    if (selectedNode != undefined) {
        // drag one node

        var modelP = modelPos(mouseX, mouseY, selectedZ);

        selectedNode.x = modelP.x;
        selectedNode.y = modelP.y;
        selectedNode.z = selectedZ;
    } else {
        centerSystem(0.05);
    }


    // rollover node
    /*
    rolloverNode = undefined;

    var fovy = (60 / 180 * this.PI);
    var camZ = this.height * 0.5 / tan(fovy);

    var maxDist = 10 / zoom;
    var maxZ = -10000;
    for (var i = 0; i < nodes.length; i++) {
        var checkNode = nodes[i];
        checkNode.diameter = nodeDiameter;

        //if (i == 0) console.log(camZ / (camZ - checkNode.z));

        var fac = (camZ / (camZ - checkNode.z));
        var screenX = checkNode.x * fac;
        var screenY = checkNode.y * fac;

        var d = dist((mouseX - offset.x) / zoom, (mouseY - offset.y) / zoom, screenX, screenY);
        if (d < maxDist && checkNode.z > maxZ) {
            rolloverNode = checkNode;
            // maxDist = d;
            maxZ = checkNode.z;
        }
    }
    if (rolloverNode != undefined) {
        rolloverNode.diameter = 5;
    }*/


    // draw little center cross
    fill(0, 120);
    stroke(0);
    strokeWeight(1);
    beginShape(LINES);
    vertex(-10, 0, 0);
    vertex(10, 0, 0);
    endShape();
    beginShape(LINES);
    vertex(0, -10, 0);
    vertex(0, 10, 0);
    endShape();


    scale(zoom);

    uMVMatrix = this._renderer.uMVMatrix.copy();
    uPMatrix = this._renderer.uPMatrix.copy();


    // draw springs
    fill(0);
    stroke(0);
    strokeWeight(0.25);
    for (var i = 0; i < springs.length; i++) {
        beginShape(LINES);
        vertex(springs[i].fromNode.x, springs[i].fromNode.y, springs[i].fromNode.z);
        vertex(springs[i].toNode.x, springs[i].toNode.y, springs[i].toNode.z);
        endShape();
    }

    // draw nodes
    directionalLight(150, 150, 150, -0.5 * zoom, 0.5 * zoom, 1.5 * zoom);
    ambientLight(80);

    noStroke();
    for (var i = 0; i < nodes.length; i++) {
        push();
        translate(nodes[i].x, nodes[i].y, nodes[i].z);

        if (nodes[i].isSelected) {
            ambientMaterial(nodes[i].hicol);
        } else {
            ambientMaterial(nodes[i].col);
        }

        sphere(nodes[i].diameter / 2);
        pop();
    }



}

// move system to center (0 < speed <= 1)
function centerSystem(speed) {
    speed = speed || 0.05;

    // average of all node positions
    var d = new Vector4D();
    for (var i = 0; i < nodes.length; i++) {
        d.add(nodes[i]);
    }
    d.div(nodes.length);

    // a fraction of this vector
    d.mult(-speed / 2);

    /*
    	// alternative: use bounding box, but that didn't work as well

        // get bounding box of all nodes
        var minPos = new Vector4D(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        var maxPos = new Vector4D(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        for (var i = 0; i < nodes.length; i++) {
            minPos.min(nodes[i]);
            maxPos.max(nodes[i]);
        }

        // distance vector to center
        var d = Vector4D.add(maxPos, minPos);
        // a fraction of this vector
        d.mult(-speed/2);
    */

    // apply to all nodes
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].add(d);
    }

}

function initNodesAndSprings() {
    // init nodes
    // dim: 0 - 11
    // moll: 12 - 23
    // Dur: 24 - 35
    // aug: 36 - 39

    var rad = nodeDiameter / 2;
    for (var i = 0; i < nodes.length; i++) {
        nodes[i] = new Node(random(-200, 200), random(-200, 200), random(-200, 200), random(-200, 200));
        nodes[i].radius = 100;
        nodes[i].strength = -5;
        nodes[i].id = i;
        nodes[i].diameter = nodeDiameter;

        if (i < 12) {
            // dim
            nodes[i].col = color("#ECDB60");
            nodes[i].hicol = color("#FCEC7F");
        } else if (i < 24) {
            // moll
            nodes[i].col = color("#A1CD73");
            nodes[i].hicol = color("#B7E883");
        } else if (i < 36) {
            // Dur
            nodes[i].col = color("#3F9A82");
            nodes[i].hicol = color("#4BB497");
        } else {
            // aug
            nodes[i].col = color("#427696");
            nodes[i].hicol = color("#508FB4");
        }

        //nodes[0].col = color(255, 0, 0);
    }

    // create springs
    springs = [];

    // 1. dim -> moll (3. versetzen)
    for (var i = 0; i < 12; i++) {
        var j = i + 12;
        appendSpring(i, j);
    }

    // 2. dim -> moll (1. versetzen)
    for (var i = 0; i < 12; i++) {
        var j = 12 + (i + 3) % 12;
        appendSpring(i, j);
    }

    // 3. dim -> Dur (3. versetzen)
    for (var i = 0; i < 12; i++) {
        var j = 24 + (i + 8) % 12;
        appendSpring(i, j);
    }

    // 4. dim -> Dur (3. versetzen)
    for (var i = 0; i < 12; i++) {
        var j = 24 + (i + 11) % 12;
        appendSpring(i, j);
    }

    // 5. dim -> dim
    for (var i = 0; i < 3; i++) {
        var j1 = (i + 3) % 12;
        var j2 = (i + 6) % 12;
        var j3 = (i + 9) % 12;
        appendSpring(i, j1);
        appendSpring(i, j2);
        appendSpring(i, j3);
        appendSpring(j1, j2);
        appendSpring(j1, j3);
        appendSpring(j2, j3);
    }

    // 6. moll -> Dur (2. versetzen)
    for (var i = 0; i < 12; i++) {
        var j = 24 + (i) % 12;
        appendSpring(i + 12, j);
    }

    // 7. moll -> Dur (1. versetzen)
    for (var i = 0; i < 12; i++) {
        var j = 24 + (i + 3) % 12;
        appendSpring(i + 12, j);
    }

    // 8. moll -> Aug
    for (var i = 0; i < 12; i++) {
        var j = 36 + (i + 3) % 4;
        appendSpring(i + 12, j);
    }

    // 9. Dur -> Aug
    for (var i = 0; i < 12; i++) {
        var j = 36 + (i) % 4;
        appendSpring(i + 24, j);
    }
}

function appendSpring(idx1, idx2) {
    var newSpring = new Spring(nodes[idx1], nodes[idx2]);
    newSpring.length = 20;
    newSpring.stiffness = 1;
    springs.push(newSpring);
}


function mousePressed() {
    if (mouseX > width || mouseY > height) {
        return;
    }

    clickPos = createVector(mouseX, mouseY);



    if (!keyIsPressed) {
        // Ignore anything greater than this distance
        var maxDist = 20;
        var maxZ = -10000;
        for (var i = 0; i < nodes.length; i++) {
            var checkNode = nodes[i];

            var screenP = screenPos(checkNode.x, checkNode.y, checkNode.z);

            var d = dist(mouseX, mouseY, screenP.x, screenP.y);
            if (d < maxDist && checkNode.z > maxZ) {
                selectedNode = checkNode;
                // maxDist = d;
                maxZ = checkNode.z;
            }
        }

        // console.log(mouseX + ", " + mouseY);
        // console.log(screenPos(selectedNode));
        // console.log(selectedNode);
        // console.log("-------------------");

        if (selectedNode != undefined) {
            selectedZ = selectedNode.z;
            selectedNode.isSelected = true;

            var i = selectedNode.id;
            var i1, i2, i3;

            if (i < 12) {
                // dim
                i1 = i;
                i2 = i1 + 3;
                i3 = i1 + 6;
            } else if (i < 24) {
                // moll
                i1 = i - 12;
                i2 = i1 + 3;
                i3 = i1 + 7;
            } else if (i < 36) {
                // Dur
                i1 = i - 24;
                i2 = i1 + 4;
                i3 = i1 + 7;
            } else {
                // aug
                i1 = i - 36;
                i2 = i1 + 4;
                i3 = i1 + 8;
            }

            samples[i1 % 12].play();
            samples[i2 % 12].play();
            samples[i3 % 12].play();

            //console.log((i1 % 12) + ", " + (i2 % 12) + ", " + (i3 % 12));

        }
    }
}


function screenPos(x, y, z) {
    if (x instanceof Vector4D) {
        y = x.y;
        z = x.z;
        x = x.x;
    }

    //    var modelview = this._renderer.uMVMatrix.mat4;
    var modelview = uMVMatrix.mat4;
    var ax = modelview[0] * x + modelview[4] * y + modelview[8] * z + modelview[12];
    var ay = modelview[1] * x + modelview[5] * y + modelview[9] * z + modelview[13];
    var az = modelview[2] * x + modelview[6] * y + modelview[10] * z + modelview[14];
    var aw = modelview[3] * x + modelview[7] * y + modelview[11] * z + modelview[15];


    //    var proj = this._renderer.uPMatrix.mat4;
    var proj = uPMatrix.mat4;
    var ox = proj[0] * ax + proj[4] * ay + proj[8] * az + proj[12] * aw;
    var oy = proj[1] * ax + proj[5] * ay + proj[9] * az + proj[13] * aw;
    var ow = proj[3] * ax + proj[7] * ay + proj[11] * az + proj[15] * aw;

    if (ow != 0) {
        ox /= ow;
        oy /= ow;
    }
    var sx = width * (1 + ox) / 2.0;
    var sy = height * (1 + oy) / 2.0;
    //sy = height - sy;

    return createVector(sx, sy);
}


function modelPos(x, y, z) {
    var f = tan(30 / 180 * PI);
    var b = (height / 2) / f - z;
    var m = (1 / zoom) - 1 + 1 / (1 + z / b);

    var mx = (x - width / 2) * m;
    var my = (y - height / 2) * m;

    return createVector(mx, my);
}


/*
  public float modelX(float x, float y, float z) {
    float ax =
      modelview.m00*x + modelview.m01*y + modelview.m02*z + modelview.m03;
    float ay =
      modelview.m10*x + modelview.m11*y + modelview.m12*z + modelview.m13;
    float az =
      modelview.m20*x + modelview.m21*y + modelview.m22*z + modelview.m23;
    float aw =
      modelview.m30*x + modelview.m31*y + modelview.m32*z + modelview.m33;

    float ox =
      cameraInv.m00*ax + cameraInv.m01*ay + cameraInv.m02*az + cameraInv.m03*aw;
    float ow =
      cameraInv.m30*ax + cameraInv.m31*ay + cameraInv.m32*az + cameraInv.m33*aw;

    return nonZero(ow) ? ox / ow : ox;
  }
*/



function mouseDragged() {
    if (selectedNode == undefined && clickPos != undefined) {
        var dy = mouseY - clickPos.y;
        zoom *= Math.pow(1.001, -dy);
        clickPos = createVector(mouseX, mouseY);
    }
}


function mouseReleased() {
    if (selectedNode != undefined) {
        selectedNode.isSelected = false;
        selectedNode = undefined;
        clickPos = undefined;
    }
}

function mouseWheel(event) {
    if (!mouseIsPressed) {
        var e = event.deltaY;
        zoom *= Math.pow(1.001, e);
    }
}



function keyPressed() {
    if (key == 'r' || key == 'R') {
        background(255);
        initNodesAndSprings();
    }
}



// trackpad rotation -------------------------------------------

var activePad;
var padClickPos;
console.log(touchend);
window.addEventListener(touchend, function(e) {
    e.preventDefault();
    if (activePad != undefined) trackpads[activePad].removeClass("pressed");
    activePad = undefined;
    clickPos = undefined;
});

function createTrackpads() {
    for (var i = 0; i < 3; i++) {
        (function() {
            var id = i;
            var pad = createDiv("");
            pad.elt.style.left = i * 210 + "px";

            pad.mousePressed(function(e) {
                e.preventDefault();
                activePad = id;
                //console.log(id);
                trackpads[activePad].addClass("pressed");
                padClickPos = createVector(e.clientX, e.clientY);
                if (isTouch) {
                    padClickPos = createVector(e.touches[0].clientX, e.touches[0].clientY);
                }
                clickPos = undefined;
                //console.log(e);
            });

            window.addEventListener(touchmove, function(e) {
                e.preventDefault();
                if (activePad == id) {

                    var dx = e.clientX - padClickPos.x;
                    var dy = e.clientY - padClickPos.y;
                    if (isTouch) {
                        dx = e.touches[0].clientX - padClickPos.x;
                        dy = e.touches[0].clientY - padClickPos.y;
                    }

                    for (var i = 0; i < nodes.length; i++) {

                        if (id == 0) {
                            nodes[i].rotateYW(dx / 100);
                            nodes[i].rotateXW(-dy / 100);
                        } else if (id == 1) {
                            // 4D rotation
                            nodes[i].rotateYZ(dx / 100);
                            nodes[i].rotateXZ(-dy / 100);
                        } else if (id == 2) {
                            // 4D rotation
                            //nodes[i].rotateZW(dx / 100);
                            nodes[i].rotateYZ(dx / 100);
                            nodes[i].rotateXY(-dy / 100);
                        }
                    }
                    padClickPos = createVector(e.clientX, e.clientY);
                    if (isTouch) {
                        padClickPos = createVector(e.touches[0].clientX, e.touches[0].clientY);
                    }
                }

            });

            trackpads.push(pad);

        }());

    }


}

function windowResized() {
    updateLayout();
}


function updateLayout() {
    var margin = 5;
    var ww = windowWidth;
    var wh = windowHeight;
    var cw = 0;
    var ch = 0;
    var padw = 0;
    var padh = 0;

    if (wh > ww) {
        // portrait mode
        padw = (ww - 4 * margin) / 3;
        padh = wh * 0.25;
        cw = ww - 2 * margin;
        ch = wh - padh - 3 * margin;
        for (var i = 0; i < 3; i++) {
            var pad = trackpads[i];
            pad.elt.style.width = Math.round(padw) + "px";
            pad.elt.style.height = Math.round(padh) + "px";
            pad.elt.style.left = (i * (Math.round(padw) + margin) + margin) + "px";
            pad.elt.style.top = (Math.round(ch) + 2 * margin) + "px";
        }
    } else {
        // landscape mode
        padw = ww * 0.25;
        padh = (wh - 4 * margin) / 3;
        cw = ww - padw - 3 * margin;
        ch = wh - 2 * margin;
        for (var i = 0; i < 3; i++) {
            var pad = trackpads[i];
            pad.elt.style.width = Math.round(padw) + "px";
            pad.elt.style.height = Math.round(padh) + "px";
            pad.elt.style.left = (Math.round(cw) + 2 * margin) + "px";
            pad.elt.style.top = (i * (Math.round(padh) + margin) + margin) + "px";
        }
    }

    resizeCanvas(cw, ch);
    offset = createVector(width / 2, height / 2);



}



/*






void keyPressed() {
  if (key=='s' || key=='S') saveFrame(timestamp()+"_##.png"); 

  if (key=='p' || key=='P') {
    savePDF = true; 
    println("saving to pdf - starting (this may take some time)");
  }

  if (key=='r' || key=='R') {
    background(255);
    initNodesAndSprings();
  }
}


String timestamp() {
  return String.format("%1$ty%1$tm%1$td_%1$tH%1$tM%1$tS", Calendar.getInstance());
}

*/