import React, { Component } from 'react';
import './App.css';
import * as THREE from 'three'

class App extends Component {
    constructor(props){
        super(props)
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mousePosition = {x: 0, y: 0};
        this.colors = {
            red:0xf25346,
            white:0xd8d0d1,
            brown:0x59332e,
            pink:0xF5986E,
            brownDark:0x23190f,
            blue:0x68c3c0,
            blue_magenta: 0x3500d3,
            cornflower_blue: 0x7391c8
        };
    }

    createScene(){
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x819ABD, 100, 950);
    }

    createCamera()  {

        const aspectRatio =  this.width / this.height;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 10000;
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        this.camera.position.x = 0;
        this.camera.position.z = 200;
        this.camera.position.y = 100;
        // const control = new OrbitControl(this.camera, this.renderer.domElement);


    }

    initRenderer(){
        this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.refs.anchor.appendChild(this.renderer.domElement);
    }

    createLight(){
        this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);
        this.shadowLight = new THREE.DirectionalLight(0xffffff, .9);

        this.shadowLight.position.set(150, 350, 350);
        this.shadowLight.castShadow = true;

        this.shadowLight.shadow.camera.left = -400;
        this.shadowLight.shadow.camera.right = 400;
        this.shadowLight.shadow.camera.top = 400;
        this.shadowLight.shadow.camera.bottom = -400;
        this.shadowLight.shadow.camera.near = 1;
        this.shadowLight.shadow.camera.far = 1000;

        this.shadowLight.shadow.mapSize.width = 2048;
        this.shadowLight.shadow.mapSize.height = 2048;

        this.ambientLight = new  THREE.AmbientLight(0xdc8874, .5);

        this.scene.add(this.hemisphereLight, this.shadowLight, this.ambientLight);
    }

    initSea() {
        this.sea = new Sea(this.colors);
        this.seaMesh = this.sea.mesh;
        this.seaMesh.position.y = -600;
        this.scene.add(this.seaMesh);
    }

    initSky(){
        this.sky = new Sky(this.colors);
        this.sky.position.y = -600;
        this.scene.add(this.sky);
    }

    initPlane(){
        this.plane = new Airplane(this.colors);
        this.planeMesh = this.plane.mesh;
        this.planeMesh.scale.set(.25,.25,.25);
        this.planeMesh.position.y = 100;
        this.planeMesh.position.z = -0;
        this.scene.add(this.planeMesh)
    }

    normalize(v, vmin, vmax, tmin, tmax){
        const nv = v; /*Math.max(Math.min(v,vmax), vmin);*/
        const dv = 2;
        const pc = (nv+1)/dv;
        const dt = tmax-tmin;
        return tmin + (pc*dt);
    }

    updatePlane(){
        const targetX = this.normalize(this.mousePosition.x, -.75, .75, -100, 100);
        const targetY = this.normalize(this.mousePosition.y,-.75, .75, 25, 175);

        this.plane.mesh.position.y += (targetY - this.plane.mesh.position.y)*0.1;
        this.planeMesh.position.x = targetX;

        this.plane.mesh.rotation.z = (targetY-this.plane.mesh.position.y)*0.0128;
        this.plane.mesh.rotation.x = (this.plane.mesh.position.y-targetY)*0.0064;

        this.plane.propellerMesh.rotation.x += .3;
        this.plane.pilot.updateHair();
    }

    initStars(){
        this.stars = new Stars();
        console.log(this.stars)
        this.scene.add(this.stars)
    }

    animate(){
        requestAnimationFrame(this.animate.bind(this))
        this.renderer.render(this.scene, this.camera);
        this.updatePlane();
        this.sky.rotation.z += 0.0025;
        this.stars.rotation.z += 0.0025;
        this.seaMesh.rotation.z += 0.0025;
        this.sea.moveWaves();
    }

    mouseMoveHandler(event){
        const tx = -1 + (event.clientX / this.width)*2;
        const ty = 1 - (event.clientY / this.height)*2;
        this.mousePosition = {x: tx, y: ty};
    }


    componentDidMount(){
        this.initRenderer();
        this.createScene();
        this.createCamera();
        this.createLight();
        this.initSea();
        this.initSky();
        this.initPlane();
        this.initStars();
        this.renderer.render(this.scene, this.camera);
        window.addEventListener('mousemove', this.mouseMoveHandler.bind(this), false);
        this.animate();
  }

  render() {
    return (
      <div className="App" ref="anchor" style={{background: 'F5986E'}}>
      </div>
    );
  }
}

class Sea{
    constructor(colors){
        this.colors = colors;
        this.geometry = new THREE.CylinderGeometry(600,600,800,40,10);

        this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
        this.geometry.mergeVertices();

        const length = this.geometry.vertices.length;

        this.waves = [];

        for (let i = 0; i < length; i++){
            const vertex  = this.geometry.vertices[i];

            this.waves.push({
                x: vertex .x,
                y: vertex .y,
                z: vertex .z,
                ang: Math.random()* Math.PI * 2,
                amp: 5 + Math.random()* 15,
                speed: 0.016 + Math.random() * 0.032
            })
        }

        this.material = new THREE.MeshPhongMaterial({
            color: this.colors.blue,
            transparent: true,
            opacity: .6,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.receiveShadow = true;
    }

    moveWaves(){
        const vertices = this.mesh.geometry.vertices;
        const length = vertices.length;

        for(let i = 0; i < length; i++){
            const vertex = vertices[i];

            const vertexWave = this.waves[i];

            vertex.x = vertexWave.x + Math.cos(vertexWave.ang)*vertexWave.amp;
            vertex.y = vertexWave.y + Math.sin(vertexWave.ang)*vertexWave.amp;

            // increment the angle for the next frame
            vertexWave.ang += vertexWave.speed;
        }
        this.mesh.geometry.verticesNeedUpdate = true;
        this.mesh.rotation.z += .005;

    }
}

class Cloud{
    constructor(colors){
        this.colors = colors;
        this.mesh = new THREE.Object3D();
        this.geometry = new THREE.BoxGeometry(20,20,20);
        this.material = new THREE.MeshPhongMaterial({
            color:this.colors.white
        });
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
        return this.mesh;
    }
}

class Sky{
    constructor(colors){
        this.colors = colors;
        this.cloudAmount = 20;
        this.stepAngle = Math.PI*2  / this.cloudAmount;
        this.mesh = new THREE.Object3D();
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
        return this.mesh;
    }
}

class Airplane {
    constructor(colors){
        this.mesh = new THREE.Object3D();
        this.colors = colors;

        this.cabinGeometry = new THREE.BoxGeometry(60,50,50,1,1,1);
        this.cabinGeometry.vertices[4].y -= 10;
        this.cabinGeometry.vertices[4].z += 20;
        this.cabinGeometry.vertices[5].y -= 10;
        this.cabinGeometry.vertices[5].z -= 20;
        this.cabinGeometry.vertices[6].y += 30;
        this.cabinGeometry.vertices[6].z += 20;
        this.cabinGeometry.vertices[7].y += 30;
        this.cabinGeometry.vertices[7].z -= 20;

        console.log(this.cabinGeometry);

        this.cabinMaterial = new THREE.MeshPhongMaterial({color:this.colors.cornflower_blue, shading:THREE.FlatShading})
        this.cabinMesh = new THREE.Mesh(this.cabinGeometry, this.cabinMaterial);
        this.cabinMesh.castShadow = true;
        this.cabinMesh.receiveShadow = true;

        this.engineGeometry = new THREE.BoxGeometry(20,50,50,1,1,1);
        this.engineMaterial = new THREE.MeshPhongMaterial({color:this.colors.white, shading:THREE.FlatShading});
        this.engineMesh = new THREE.Mesh(this.engineGeometry, this.engineMaterial);
        this.engineMesh.position.x = 40;
        this.engineMesh.castShadow = true;
        this.engineMesh.receiveShadow = true;

        this.tailGeometry = new THREE.BoxGeometry(15,20,5,1,1,1);
        this.tailMaterial = new THREE.MeshPhongMaterial({color:this.colors.cornflower_blue, shading:THREE.FlatShading});
        this.tailMesh = new THREE.Mesh(this.tailGeometry, this.tailMaterial);
        this.tailMesh.position.set(-30,15,0);
        this.tailMesh.receiveShadow = true;
        this.tailMesh.castShadow = true;

        this.tailplaneGeometry = new THREE.BoxGeometry(8, 4, 45, 1 ,1 ,1);

        this.tailplaneGeometry.vertices[4].y -= 2;
        this.tailplaneGeometry.vertices[4].z += 2;
        this.tailplaneGeometry.vertices[5].y -= 2;
        this.tailplaneGeometry.vertices[5].z -= 2;
        this.tailplaneGeometry.vertices[6].y += 2;
        this.tailplaneGeometry.vertices[6].z += 2;
        this.tailplaneGeometry.vertices[7].y += 2;
        this.tailplaneGeometry.vertices[7].z -= 2;

        this.tailplane = new THREE.Mesh(this.tailplaneGeometry, this.tailMaterial);

        this.tailMesh.add(this.tailplane);

        this.wingGeometry = new THREE.BoxGeometry(40,8,150,1,1,1);

        this.wingGeometry.vertices[0].y += 1;
        this.wingGeometry.vertices[1].y += 1;
        this.wingGeometry.vertices[2].y -= 1;
        this.wingGeometry.vertices[3].y -= 1;
        this.wingGeometry.vertices[4].y -= 3;
        this.wingGeometry.vertices[5].y -= 3;
        this.wingGeometry.vertices[6].y += 3;
        this.wingGeometry.vertices[7].y += 3;

        this.wingMaterial = new THREE.MeshPhongMaterial({color:this.colors.cornflower_blue, shading:THREE.FlatShading});
        this.wingMesh = new THREE.Mesh(this.wingGeometry, this.wingMaterial);
        this.wingMesh.castShadow = true;
        this.wingMesh.receiveShadow = true;

        this.propellerGeometry = new THREE.BoxGeometry(20,10,10,1,1,1);
        this.propellerMaterial = new THREE.MeshPhongMaterial({color:this.colors.brown, shading:THREE.FlatShading});
        this.propellerMesh = new THREE.Mesh(this.propellerGeometry, this.propellerMaterial);
        this.propellerMesh.castShadow = true;
        this.propellerMesh.receiveShadow = true;

        this.bladeGeometry = new THREE.BoxGeometry(1,100,20,1,1,1);
        this.bladeMaterial = new THREE.MeshPhongMaterial({color:this.colors.brownDark, shading:THREE.FlatShading});
        this.bladeMesh = new THREE.Mesh(this.bladeGeometry, this.bladeMaterial);
        this.bladeMesh.position.set(8,0,0);
        this.bladeMesh.castShadow = true;
        this.bladeMesh.receiveShadow = true;


        this.propellerMesh.add(this.bladeMesh);
        this.propellerMesh.position.set(50, 0, 0);

        this.chassisGeometry = new THREE.BoxGeometry(7, 15, 5, 1, 1, 1);
        this.chassisMaterial = new THREE.MeshPhongMaterial({color:this.colors.cornflower_blue, shading:THREE.FlatShading});
        this.chassis = new THREE.Mesh(this.chassisGeometry, this.chassisMaterial);

        this.wheelGeometry = new THREE.BoxGeometry(15, 15, 3, 1, 1, 1);
        this.wheelMaterial = new THREE.MeshPhongMaterial({color:this.colors.brownDark, shading:THREE.FlatShading});
        this.wheel = new THREE.Mesh(this.wheelGeometry, this.wheelMaterial);
        this.wheel.position.y = -5;

        this.chassis.add(this.wheel);
        this.chassis.position.set(-5, -15, 0);

        this.pilot = new Pilot(this.colors);
        this.pilot.mesh.position.set(5, 35, 0);

        this.mesh.add(this.cabinMesh, this.engineMesh, this.tailMesh, this.wingMesh, this.propellerMesh, this.pilot.mesh, this.chassis);
    }

}

class  Pilot {
    constructor(colors){
        this.mesh = new THREE.Object3D();
        this.colors = colors;
        this.mesh.name = "pilot";
        this.angleHairs = 0;

        this.bodyGeometry = new THREE.BoxGeometry(15,15,15);
        this.bodyMaterial = new THREE.MeshPhongMaterial({color:this.colors.brown, shading:THREE.FlatShading});
        this.bodyMesh = new THREE.Mesh(this.bodyGeometry, this.bodyMaterial);
        this.bodyMesh.position.set(2,-12,0);


        this.faceGeometry = new THREE.BoxGeometry(10,10,10);
        this.faceMaterial = new THREE.MeshLambertMaterial({color:this.colors.pink});
        this.faceMesh = new THREE.Mesh(this.faceGeometry, this.faceMaterial);

        this.hairGeometry = new THREE.BoxGeometry(4, 4, 4);
        this.hairMaterial = new THREE.MeshLambertMaterial({color:this.colors.brown});
        this.hairMesh = new THREE.Mesh(this.hairGeometry, this.hairMaterial);
        this.hairMesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));

        this.hairs = new THREE.Object3D();
        this.hairsTop = new THREE.Object3D();

        for (let i=0; i<12; i++){
            const h = this.hairMesh.clone();
            const col = i%3;
            const row = Math.floor(i/3);
            const startPosZ = -4;
            const startPosX = -4;
            h.position.set(startPosX + row*4, 0, startPosZ + col*4);
            this.hairsTop.add(h);
        }

        this.hairSideGeometry = new THREE.BoxGeometry(12,4,2);
        this.hairSideGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
        this.hairRight = new THREE.Mesh(this.hairSideGeometry, this.hairMaterial);
        this.hairLeft = this.hairRight.clone();

        this.hairRight.position.set(8,-2,6);
        this.hairLeft.position.set(8,-2,-6);

        this.hairBackGeometry = new THREE.BoxGeometry(2,8,10);
        this.hairBack = new THREE.Mesh(this.hairBackGeometry, this.hairMaterial);
        this.hairBack.position.set(-1,-4,0);

        this.hairs.add(this.hairsTop, this.hairRight, this.hairLeft, this.hairBack);
        this.hairs.position.set(-5,5,0);

        this.glassGeometry = new THREE.BoxGeometry(5,5,5);
        this.glassMaterial = new THREE.MeshLambertMaterial({color:this.colors.brown});
        this.glassRight = new THREE.Mesh(this.glassGeometry, this.glassMaterial);
        this.glassRight.position.set(6,0,3);
        this.glassLeft = this.glassRight.clone();
        this.glassLeft.position.z = -this.glassRight.position.z;

        this.glassAGeometry = new THREE.BoxGeometry(11,1,11);
        this.glassA = new THREE.Mesh(this.glassAGeometry, this.glassMaterial);

        this.earGeometry = new THREE.BoxGeometry(2,3,2);
        this.earLeft = new THREE.Mesh(this.earGeometry, this.faceMaterial);
        this.earLeft.position.set(0,0,-6);
        this.earRight = this.earLeft.clone();
        this.earRight.position.set(0, 0, 6);

        this.mesh.add(this.bodyMesh, this.faceMesh, this.hairs, this.glassRight, this.glassLeft, this.glassA, this.earRight, this.earLeft);
    }

    updateHair(){
        const hairs = this.hairsTop.children;

        const length = hairs.length;

        for(let i = 0; i < length; i++){
            const hair = hairs[i];
            hair.scale.y = .75 + Math.cos(this.angleHairs + i / 3) * .25;
        }
        this.angleHairs += 0.16;
    }
    
}

class Stars{
    constructor(){
        const count = 1000;
        this.mesh = new THREE.Object3D();
        this.stepAngle = Math.PI*2  / count;

        this.starGeometry = new THREE.SphereGeometry(1, 50, 50);
        this.starMaterial = new THREE.MeshPhysicalMaterial({color: 0xfffff0, shininess: 90});

        for (let i = 0; i<count; i++){
            const starMesh = new THREE.Mesh(this.starGeometry, this.starMaterial);
            const finalCloudAngle = this.stepAngle * i;
            const high = 150 + Math.random() * 200;

            const coordinates = this.calculateCoordinates(finalCloudAngle, high);
            starMesh.position.set(coordinates.x, coordinates.y, coordinates.z);
            this.mesh.add(starMesh);
        }
        this.mesh.y = -100;
        return this.mesh;
    }

    calculateCoordinates(finalCloudAngle, high){
        let x, y, z;
        y = Math.sin(finalCloudAngle) * high + 100; //converting from polar to Cartesian coordinates
        x = Math.cos(finalCloudAngle) * high;
        z = 100 - Math.random() * 400;

        return {x, y, z};
    }
}

export default App;
