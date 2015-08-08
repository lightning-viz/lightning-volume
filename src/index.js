'use strict';

var LightningVisualization = require('lightning-visualization');
var _ = require('lodash');
var THREE = require('three.js');
require('three-fly-controls')(THREE);

/*
 * Extend the base visualization object
 */
var Visualization = LightningVisualization.extend({

    getDefaultOptions: function() {
        return {
            rotateZ: false
        };
    },

    init: function() {
        this.scene = new THREE.Scene();

        var renderer = new THREE.WebGLRenderer({ alpha: true});
        renderer.setSize(this.width, this.height);

        this.el.appendChild( renderer.domElement );

        var camera = new THREE.PerspectiveCamera( 50, this.width / this.height, 1, 500 );
        camera.position.z = 175;

        THREE.ImageUtils.crossOrigin = '';

        _.each(this.images, function(img, i) {
            this.initializeImage(img, i);
        }, this);

        camera.lookAt(new THREE.Vector3(0,0,175));

        this.controls = new THREE.FlyControls(camera, this.el);
        this.renderer = renderer;
        this.camera = camera;

        this.animate();
    },

    getHeight: function() {
        return this.width * 0.7;
    },

    animate: function() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    },

    render: function() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    },

    formatData: function(data) {
        return data;
    },

    imageOnload: function(img, i) {
        var geometry = new THREE.PlaneGeometry(img.width, img.height, 1);
        
        THREE.ImageUtils.crossOrigin = '';
        var texture = THREE.ImageUtils.loadTexture( img.src );
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        var material = new THREE.MeshBasicMaterial( {map: texture, opacity: 0.05, transparent: true, blending: THREE.NormalBlending  } );
        material.side = THREE.DoubleSide;

        var mesh = new THREE.Mesh( geometry,  material );
        mesh.position.z = i;
        if(this.options.rotateZ) {
            mesh.rotation.z = Math.PI / 2;
        }
        this.scene.add( mesh );
    },

    initializeImage: function(imageData, i) {
        var self = this;
        var img = new Image();
        img.crossOrigin = '';
        img.src = imageData;
        img.onload = this.imageOnload.bind(this, img, i);
    },

    addImage: function(imageData) {
        this.images.push(imageData);
        this.initializeImage(imageData, this.images.length - 1);
    },

    appendData: function(images) {    
        // can be a single image or an array of images
        if(_.isArray(images)) {
            _.each(images, function(image) {
                this.addImage(image);        
            });
        } else {
            this.addImage(images);
        }
    }
});


module.exports = Visualization;
