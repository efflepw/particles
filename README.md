# Particles package

To use the script, connect the index.js to your index.html file, and add the <canvas id="canvas" /> tag.

You can locally start the project using the Live Server extension and run it while you are inside the index.html file.

The main feature is waves that move particles around the canvas. Waves can be enabled and disabled.
It uses a lot of performance since the current complexity is p * w (where p is the number of particles and w is the number of waves).

You can enable mouse interaction with particles by toggling values in CONFIG. Mouse interaction has three modes: OFF, ATTRACTION, and REPULSION. It's pretty self-explanatory what these modes do.
