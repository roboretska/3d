import * as THREE from "three/src/Three";

export default class Sea{
    constructor(colors){
        this.colors = colors;
        this.createGeometry();
        this.createMaterial();
        this.createMesh();
        return this.seaMesh;
    }

    createGeometry(){
        this.seaGeometry = new THREE.CylinderGeometry(800,800,800,40,10);
        this.seaGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

    }

    createMaterial(){
        this.seaMaterial = new THREE.MeshNormalMaterial();
        //     new THREE.MeshPhongMaterial({
        //     color:this.colors.blue,
        //     // color:this.colors.blue,
        //     transparent:true,
        //     opacity:.6,
        //     shading:THREE.FlatShading,
        // })
    }

    createMesh(){
        this.seaMesh = new THREE.Mesh(this.seaGeometry, this.seaMaterial);
        this.seaMesh.receiveShadow = true;
    }
}