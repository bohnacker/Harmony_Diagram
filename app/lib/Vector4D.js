class Vector4D {

    constructor(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 0;
    }

    copy() {
        return new Vector4D(this.x, this.y, this.z, this.w);
    }

    toString() {
        return "[ " + this.x + ", " + this.y + ", " + this.z + ", " + this.w + " ]";
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    };

    magSq() {
        return (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    };


    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
    };

    static add(v1, v2) {
        return new Vector4D(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, v1.w + v2.w);
    };

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
        return this;
    };

    static sub(v1, v2) {
        return new Vector4D(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z, v1.w - v2.w);
    };

    mult(n) {
        if (n instanceof p5.Matrix) {
            var m = n.mat4;
            var newx = this.x * m[0] + this.y * m[4] + this.z * m[8] + m[12];
            var newy = this.x * m[1] + this.y * m[5] + this.z * m[9] + m[13];
            var newz = this.x * m[2] + this.y * m[6] + this.z * m[10] + m[14];
            this.x = newx;
            this.y = newy;
            this.z = newz;
        } else {
            this.x *= n;
            this.y *= n;
            this.z *= n;
            this.w *= n; 
        }
        return this;
    };

    static mult(n) {
        return new Vector4D(this.x * n, this.y * n, this.z * n, this.w * n);
    };

    div(n) {
        this.x /= n;
        this.y /= n;
        this.z /= n;
        this.w /= n;
        return this;
    };

    static div(n) {
        return new Vector4D(this.x / n, this.y / n, this.z / n, this.w / n);
    };

    dist(v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        var dz = this.z - v.z;
        var dw = this.w - v.w;
        return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
    };

    static dist(v1, v2) {
        var dx = v1.x - v2.x;
        var dy = v1.y - v2.y;
        var dz = v1.z - v2.z;
        var dw = v1.w - v2.w;
        return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
    };

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    };

    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
    };


    normalize() {
        var m = this.mag();
        if (m != 0 && m != 1) {
            this.div(m);
        }
        return this;
    };

    limit(max) {
        if (this.magSq() > max * max) {
            this.normalize();
            this.mult(max);
        }
        return this;
    };

    // componentwise min
    min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);
        this.w = Math.min(this.w, v.w);
    }

    static min(v1, v2) {
        var mx = Math.min(v1.x, v2.x);
        var my = Math.min(v1.y, v2.y);
        var mz = Math.min(v1.z, v2.z);
        var mw = Math.min(v1.w, v2.w);
        return new Vector4D(mx, my, mz, mw);
    }

    // componentwise max
    max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        this.w = Math.max(this.w, v.w);
    }

    static max(v1, v2) {
        var mx = Math.max(v1.x, v2.x);
        var my = Math.max(v1.y, v2.y);
        var mz = Math.max(v1.z, v2.z);
        var mw = Math.max(v1.w, v2.w);
        return new Vector4D(mx, my, mz, mw);
    }


    rotate(a) {
        var newy = this.y * Math.cos(a) - this.z * Math.sin(a);
        var newz = this.y * Math.sin(a) + this.z * Math.cos(a);
        this.y = newy;
        this.z = newz;
        return this;
    }

    // 3D rotations
    rotateX(a) {
        return this.rotate(a);
    }

    rotateY(a) {
        var newx = this.x * Math.cos(-a) - this.z * Math.sin(-a);
        var newz = this.x * Math.sin(-a) + this.z * Math.cos(-a);
        this.x = newx;
        this.z = newz;
        return this;
    }

    rotateZ(a) {
        var newx = this.x * Math.cos(a) - this.y * Math.sin(a);
        var newy = this.x * Math.sin(a) + this.y * Math.cos(a);
        this.x = newx;
        this.y = newy;
        return this;
    }

    // 4D rotations
    rotateXW(a) {
        return this.rotate(a);
    }

    rotateYW(a) {
        return this.rotateY(a);
    }

    rotateZW(a) {
        return this.rotateZ(a);
    }

    rotateXY(a) {
        var neww = this.w * Math.cos(a) - this.z * Math.sin(a);
        var newz = this.w * Math.sin(a) + this.z * Math.cos(a);
        this.w = neww;
        this.z = newz;
        return this;
    }

    rotateXZ(a) {
        var neww = this.w * Math.cos(a) - this.y * Math.sin(a);
        var newy = this.w * Math.sin(a) + this.y * Math.cos(a);
        this.w = neww;
        this.y = newy;
        return this;
    }

    rotateYZ(a) {
        var neww = this.w * Math.cos(a) - this.x * Math.sin(a);
        var newx = this.w * Math.sin(a) + this.x * Math.cos(a);
        this.w = neww;
        this.x = newx;
        return this;
    }



}



/*
// Alternative class declaration:


function Vector4D(x, y, z, w) {
    p5.Vector.call(this, x, y, z);

    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
}

Vector4D.prototype = Object.create(p5.Vector.prototype);
Vector4D.prototype.constructor = Vector4D;

Vector4D.prototype.copy = function() {
    return new Vector4D(this.x, this.y, this.z, this.w);
};

Vector4D.prototype.toString = function() {
    return "[ " + this.x + ", " + this.y + ", " + this.z + ", " + this.w + " ]";
};

Vector4D.prototype.mag = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
};

Vector4D.prototype.magSq = function() {
    return (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
};
*/