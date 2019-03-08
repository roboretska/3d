import React, { Component } from 'react';
import './App.css';
import * as THREE from 'three'
import Sea from './components/Sea';
import Sky from "./components/Sky";

class App extends Component {
    constructor(props){
        super(props);
        this.colors = {
            red:0xf25346,
            white:0xd8d0d1,
            brown:0x59332e,
            pink:0xF5986E,
            brownDark:0x23190f,
            blue:0x68c3c0,
        };
    }

    createScene(){
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    }

    createCamera(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        const aspectRatio =  this.width / this.height;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 10000;
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        this.camera.position.x = 0;
        this.camera.position.z = 200;
        this.camera.position.y = 100;
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

        this.scene.add(this.hemisphereLight);
        this.scene.add(this.shadowLight);
    }

    initSea() {
        this.sea = new Sea(this.colors);
        console.log(this.sea);
        this.sea.position.y = -600;
        this.scene.add(this.sea);
    }

    initSky(){
        this.sky = new Sky(this.colors);
        this.sky.position.y = -600;
        this.scene.add(this.sky);
    }

    animate(){
        requestAnimationFrame(this.animate.bind(this))
        this.renderer.render(this.scene, this.camera);
    }


  componentDidMount(){
        this.createScene();
        this.createCamera();
        this.initRenderer();
        this.createLight();
        this.initSea();
        this.initSky();
        this.camera.lookAt(this.sea.position);
        console.log(this.scene);
        console.log(this.renderer.domElement.parentNode);
        this.renderer.render(this.scene, this.camera);
        this.animate();
  }

  render() {
    return (
      <div className="App" ref="anchor" style={{background: 'F5986E'}}>
      </div>
    );
  }
}

export default App;
