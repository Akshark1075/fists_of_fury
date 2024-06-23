import * as THREE from "three";

const shaders = [
  //Basic Shader Pair
  {
    vertexShader: `
                uniform vec3 customColor; // Define a uniform variable to hold the custom color
    
                varying vec3 vColor;
    
                void main() {
                    vColor = customColor;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
    fragmentShader: `
                varying vec3 vColor;
    
                void main() {
                    gl_FragColor = vec4(vColor, 1.0);
                }
            `,
  },
  //Phong Shading Pair
  {
    vertexShader: `
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            

            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vNormal = normalMatrix * normal;
                vViewPosition = -mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
    fragmentShader: `
            varying vec3 vNormal;
            varying vec3 vViewPosition;

            void main() {
                vec3 normal = normalize(vNormal);
                vec3 viewDir = normalize(vViewPosition);
                vec3 lightDir = vec3(0.0, 0.0, 1.0); 

                // Calculate Phong lighting
                float ambientStrength = 0.3;
                float diffuseStrength = max(dot(normal, lightDir), 0.0);
                vec3 ambient = ambientStrength * vec3(1.0);
                vec3 diffuse = vec3(1.0) * diffuseStrength;
                vec3 result = ambient + diffuse;

                gl_FragColor = vec4(result, 1.0);
            }
        `,
  },
  //Texture Mapping Pair
  {
    vertexShader: `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform sampler2D texture;
            varying vec2 vUv;

            void main() {
                gl_FragColor = texture2D(texture, vUv);
            }
        `,
  },
];

export default shaders;
