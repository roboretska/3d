/**
 * Created by Ellyson on 5/11/2018.
 */
/**
 * Created by Ellyson on 5/11/2018.
 */

import React from 'react';
import {Button} from 'react-bootstrap';
import * as THREE from 'three';

const OrbitControls = require('three-orbit-controls')(THREE);

export default class Name extends React.Component {
    constructor(){
        super();
        this.state = {
            checked: false
        };
        this.time = 0;
    }

    initScene(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
    }

    initRenderer(){
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize( window.innerWidth, window.innerHeight);
        this.refs.anchor.appendChild(this.renderer.domElement);

    }
    initCamera(){
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight , 0.1, 2000 );
    }

    initControls(){
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set(1366/2, 768/2, 770);
        this.controls.target.set(1366/2, 768/2, 0);
    }

    componentDidMount() {

        this.initRenderer();
        this.initScene();
        this.initCamera();
        // this.initControls();

        this.looped = true;
        this.animate();

    }
    componentWillUnmount(){
        this.renderer = null;
        this.looped = false;
        // window.cancelAnimationFrame(requestId);
    }
    animate() {
        if(!this.looped) return;
        requestAnimationFrame( this.animate.bind(this));
        this.time++;
        this.renderer.render( this.scene, this.camera );
    }


    render() {
        return (
            <div>
                <header style={{position:"fixed",left:"15px",top:"15px"}} className="">
                </header>
                <div ref="anchor" style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden"}} />
            </div>)
    }
}