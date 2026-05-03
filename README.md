# Solar System with WebGL and Web Audio

## Overview

This project is an interactive 3D visualization of our solar system, built entirely with web technologies. It leverages WebGL via the Three.js library for rendering and the WebPd runtime to generate dynamic, thematic audio for each planet using a Pure Data patch.

A key feature of this project is its use of procedural generation. All celestial body textures are created in real-time using a custom Perlin noise and Fractal Brownian Motion (FBM) implementation in JavaScript. This means that every planet's appearance is unique and generated on-the-fly, without relying on static image files.

The audio landscape is equally dynamic, with a unique musical theme for each planet that is generated and modulated by the Pure Data patch running in the browser.

## Core Technologies

| Category | Technology | Purpose |
|----------|------------|---------|
| **Graphics** | [Three.js](https://threejs.org/) | 3D rendering and scene management in WebGL. |
| **Audio** | [WebPd](https://github.com/sebpiq/WebPd) | Runs a Pure Data (`.pd`) patch in the browser for real-time audio synthesis. |
| **Texture Generation** | Perlin Noise / FBM | Custom JavaScript implementation for creating procedural planet textures. |
| **Language** | JavaScript (ES6+) | Core application logic, interaction, and procedural generation. |
| **Markup** | HTML5 | Structure of the application. |
| **Styling** | CSS3 | Visual styling and layout. |

## Usage

Open the `solar-system-pd-clean.html` file in a web browser.

## Video Demonstration

[![demo](https://img.youtube.com/vi/eUc5V2GvTuY/0.jpg)](https://youtu.be/eUc5V2GvTuY)

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [WebPd Runtime](https://www.npmjs.com/package/@webpd/runtime)
- [The Book of Shaders (on Noise)](https://thebookofshaders.com/11/)
- [Pure Data Official Site](https://puredata.info/)