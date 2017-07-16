class Spring {

    constructor(theFromNode, theToNode, theLength, theStiffness, theDamping) {
        this.fromNode = theFromNode;
        this.toNode = theToNode;

        this.length = theLength || 100;
        this.stiffness = theStiffness || 0.6;
        this.damping = theDamping || 0.9;
    }

    // ------ apply forces on spring and attached nodes ------
    update() {
        // calculate the target position
        // target = normalize(to - from) * length + from
        var diff = Vector4D.sub(this.toNode, this.fromNode);
        diff.normalize();
        diff.mult(this.length);
        var target = Vector4D.add(this.fromNode, diff);
        var force = Vector4D.sub(target, this.toNode);
        force.mult(0.5);
        force.mult(this.stiffness);
        force.mult(1 - this.damping);

        this.toNode.velocity.add(force);
        force.mult(-1);
        this.fromNode.velocity.add(force);
    }

}
