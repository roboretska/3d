import * as THREE from "three/src/Three";
import Cloud from './Cloud';

export default class Sky {
    constructor(colors){
        this.colors = colors;
        this.cloudAmount = 20;
        this.stepAngle = Math.PI*2  / this.cloudAmount;
        this.initMesh();
        this.createClouds();
        return this.mesh;

    }

    initMesh(){
        this.mesh = new THREE.Object3D();
    }

    createClouds() {
        for (let i = 0; i < this.cloudAmount; i++) {
            const cloud = new Cloud(this.colors);
            const finalCloudAngle = this.stepAngle * i;
            const highFromCylinderCenter = 750 + Math.random() * 200;

            cloud.position.y = Math.sin(finalCloudAngle) * highFromCylinderCenter; //converting from polar to Cartesian coordinates
            cloud.position.x = Math.cos(finalCloudAngle) * highFromCylinderCenter;

            cloud.rotation.z = finalCloudAngle + Math.PI / 2;
            cloud.position.z = -400 - Math.random() * 400;

            const scale = 1 + Math.random() * 2;
            cloud.scale.set(scale, scale, scale);

            this.mesh.add(cloud);
        }
    }
}