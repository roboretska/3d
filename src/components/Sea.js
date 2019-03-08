import * as THREE from "three/src/Three";

export default class Sea{
    constructor(colors){
        this.colors = colors;
        this.createGeometry();
        this.createMaterial();
        this.createMesh();
        return this.mesh;
    }

    createGeometry(){
        this.geometry = new THREE.CylinderGeometry(800,800,800,40,10);
        this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    }

    createMaterial(){
        this.material = new THREE.MeshPhongMaterial({
            color:this.colors.blue,
            transparent:true,
            opacity:.6,
            shading:THREE.FlatShading
         })
    }

    createMesh(){
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.receiveShadow = true;
    }
}