import * as THREE from "three/src/Three";

export default class Clouds {
    constructor(colors){
        this.colors = colors;
        this.initMesh();
        this.initGeometry();
        this.initMaterial();
        this.createGeometry();
        return this.mesh;
    }

    initMesh(){
        this.mesh = new THREE.Object3D();
    }

    initGeometry(){
        this.geometry = new THREE.BoxGeometry(20,20,20);
    }

    initMaterial(){
        this.material = new THREE.MeshPhongMaterial({
            color:this.colors.white
        });
    }

    createGeometry(){
        const nBlocs = 3+Math.floor(Math.random()*3);
        for (let i = 0; i < nBlocs; i++) {
            const mesh = new THREE.Mesh(this.geometry, this.material);

            mesh.position.x = i * 15;
            mesh.position.y = Math.random() * 10;
            mesh.position.z = Math.random() * 10;
            mesh.rotation.z = Math.random() * Math.PI * 2;
            mesh.rotation.y = Math.random() * Math.PI * 2;

            const scale = .1 + Math.random() * .9;
            mesh.scale.set(scale, scale, scale);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.mesh.add(mesh);
        }
    }

}