class Node extends Vector4D {

    constructor(x, y, z, w) {
        super(x, y, z, w);

        this.id = "";
        this.diameter = 0;

        this.minX = -Number.MAX_VALUE;
        this.maxX = Number.MAX_VALUE;
        this.minY = -Number.MAX_VALUE;
        this.maxY = Number.MAX_VALUE;
        this.minZ = -Number.MAX_VALUE;
        this.maxZ = Number.MAX_VALUE;
        this.minW = -Number.MAX_VALUE;
        this.maxW = Number.MAX_VALUE;

        this.velocity = new Vector4D();
        this.pVelocity = new Vector4D();
        this.maxVelocity = 10;

        this.damping = 0.5;
        // radius of impact
        this.radius = 200;
        // strength: positive for attraction, negative for repulsion (default for Nodes)
        this.strength = -1;
        // parameter that influences the form of the function
        this.ramp = 1.0;

        this.col = "#000000";
        this.hicol = "#000000";
        this.isSelected = false;
    }


    attract(theNode) {
        if (theNode instanceof Array) {

            // attraction or repulsion part
            for (var i = 0; i < theNode.length; i++) {
                var otherNode = theNode[i];
                // stop when empty
                if (otherNode != null && otherNode != this) {
                    this.attract(otherNode);
                }

            }

        } else {

            var d = Vector4D.dist(this, theNode);

            if (d > 0 && d < this.radius) {
                var s = pow(d / this.radius, 1 / this.ramp);
                var f = s * 9 * this.strength * (1 / (s + 1) + ((s - 3) / 4)) / d;
                var df = Vector4D.sub(this, theNode);
                df.mult(f);

                theNode.velocity.x += df.x;
                theNode.velocity.y += df.y;
                theNode.velocity.z += df.z;
                theNode.velocity.w += df.w;
            }

        }

    }


    update(theLockX, theLockY, theLockZ, theLockW) {

        this.velocity.limit(this.maxVelocity);

        if (!theLockX) this.x += this.velocity.x;
        if (!theLockY) this.y += this.velocity.y;
        if (!theLockZ) this.z += this.velocity.z;
        if (!theLockW) this.w += this.velocity.w;

        if (this.x < this.minX) {
            this.x = this.minX - (this.x - this.minX);
            this.velocity.x = -this.velocity.x;
        }
        if (this.x > this.maxX) {
            this.x = this.maxX - (this.x - this.maxX);
            this.velocity.x = -this.velocity.x;
        }

        if (this.y < this.minY) {
            this.y = this.minY - (this.y - this.minY);
            this.velocity.y = -this.velocity.y;
        }
        if (this.y > this.maxY) {
            this.y = this.maxY - (this.y - this.maxY);
            this.velocity.y = -this.velocity.y;
        }

        if (this.z < this.minZ) {
            this.z = this.minZ - (this.z - this.minZ);
            this.velocity.z = -this.velocity.z;
        }
        if (this.z > this.maxZ) {
            this.z = this.maxZ - (this.z - this.maxZ);
            this.velocity.z = -this.velocity.z;
        }

        this.velocity.mult(1 - this.damping);
    }

}