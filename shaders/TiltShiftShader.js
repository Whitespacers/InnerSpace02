const TiltShiftShader = {
  uniforms: {
    tDiffuse: { value: null },
    bluramount: { value: 0.2 },
    center: { value: 1.0 },
    stepSize: { value: 0.004 },
    steps: { value: 10.0 },
  },

  vertexShader: /* glsl */ `

		varying highp vec2 vUv;

			void main() {

				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

  fragmentShader: /* glsl */ `

		uniform sampler2D tDiffuse;		
        uniform float bluramount;
        uniform float center;
        uniform float stepSize;
        uniform float steps;

		varying highp vec2 vUv;
       
		void main(){

            float minOffs = (float(steps-1.0)) / -2.0;
            float maxOffs = (float(steps-1.0)) / +2.0;
            
            vec2 tcoord = vUv.xy ;
            
            float amount;
            vec4 blurred;

            //Work out how much to blur based on the mid point 
            amount = pow((tcoord.y * center) * 2.0 - 1.0, 2.0) * bluramount;
        
            //This is the accumulation of color from the surrounding pixels in the texture
            blurred = vec4(0.0, 0.0, 0.0, 1.0);

            //From minimum offset to maximum offset
            for (float offsX = minOffs; offsX <= maxOffs; ++offsX) {
                for (float offsY = minOffs; offsY <= maxOffs; ++offsY) {

                        //copy the coord so we can mess with it
                    vec2 temp_tcoord = tcoord.xy;

                        //work out which uv we want to sample now
                    temp_tcoord.x += offsX * amount * stepSize;
                    temp_tcoord.y += offsY * amount * stepSize;

                        //accumulate the sample 
                    blurred += texture2D(tDiffuse, temp_tcoord);
                
                } //for y
            } //for x 
                
                //because we are doing an average, we divide by the amount (x AND y, hence steps * steps)
            blurred /= float(steps * steps);

            
			// gl_FragColor = texture2D(tDiffuse, vUv);
            gl_FragColor = blurred;

		}`,
};

export { TiltShiftShader };
