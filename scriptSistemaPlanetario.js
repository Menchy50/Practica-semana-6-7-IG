import * as THREE from "three";

// Fuentes
//https://threejs.org/docs/#manual/en/introduction/Creating-a-scene -->
//Crea el grafo de escena
const scene = new THREE.Scene();
//Define la cámara (fov vertical, aspecto, planos cercano y lejano)
const camera = new THREE.PerspectiveCamera( 75,
				window.innerWidth / window.innerHeight, 0.1, 1000 );

//Reproductor WebGL
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//Se activan las sombras
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // por defecto THREE.PCFShadowMap
document.body.appendChild( renderer.domElement );

//Añade al HTML DOM (Document Object Model)
document.body.appendChild( renderer.domElement );

let estrella,
  Planetas = [],
  Lunas = [],
  objetos = [];
let t0 = 0;
let accglobal = 0.001;
let timestamp;
//Para guardar las órbitas de los planetas activos
const planetasDiccionario = {};
let planetaObjetivo = null;
let Naves = [];
let camaraModo = "general";

//Objeto cubo con una geometría de caja
const geometry = new THREE.SphereBufferGeometry(1.8, 32, 32);
const material = new THREE.MeshBasicMaterial( { color: 0xffd700 } );
const esfera = new THREE.Mesh( geometry, material );
//Objeto añadido a la escena
esfera.position.set(0, 0, 0);

scene.add( esfera );

//Puse luz ambiental, ya que la otra me parecía que se veía más "sucia"
const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(luzAmbiental);

const luzSol = new THREE.PointLight(0xffffff, 2, 100);
luzSol.position.set(0, 0, 0);
scene.add(luzSol);

//Texturas
const txMercurio = new THREE.TextureLoader().load("https://threejs.org/examples/textures/planets/mercury.jpg");
const txEarth = new THREE.TextureLoader().load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg");

//Posición de la cámara
camera.position.x = 0
camera.position.y = 0;
camera.position.z = 70;
camera.lookAt(0, 0, 0);

//Nave
Nave(0.2, 5.2, 1.2, 0.8, 2.5, 0xaaaaaa);

//Mercurio
Planeta("Mercurio", 0.2, 3.0, 2.5, 0xaaaaaa,1.0,1.0);//con f1 y f2 para una órbita circular
//Venus
Planeta("Venus", 0.35, 4.5, 1.8, 0xe3bb76,1.0,1.0);
//Tierra
Planeta("Tierra", 0.4, 6.0, 1.4, 0x2233ff,1.0,1.0, txEarth);
//Marte
Planeta("Marte", 0.3, 7.8, 1.0, 0xcc4400,1.05,0.95);
//Jupiter
Planeta("Jupiter", 0.9, 10.5, 0.6, 0xd4a373,1.0,1.0);
//Saturno
Planeta("Saturno", 0.75, 13.5, 0.4, 0xf4e2bb,1.0,1.0);
//Urano
Planeta("Urano", 0.55, 16.5, 0.25, 0x76c7c0,1.0,1.0);
//Neptuno
Planeta("Neptuno", 0.55, 19.0, 0.15, 0x3333cc,1.0,1.0);

//Lunas
//Tierra
//LUNA
Luna(Planetas[2],0.1,0.8,4.0,0xcccccc);
//Marte
//Fobos
Luna(Planetas[3],0.04,0.5,5.5,0x888888);
//Deimos
Luna(Planetas[3],0.03,0.75,3.5,0xaaaaaa);
//Jupiter
//Ío
Luna(Planetas[4],0.12,1.5,4.5,0xffcc00);
//Ganimedes
Luna(Planetas[4],0.18,2.2,2,8,0x999999);
//Saturno
//Titán
Luna(Planetas[5],0.2,2,3.0,0xd4a373);
//Encédalo
Luna(Planetas[5],0.05,1.3,5.0,0xffffff);
//Urano
//Titania
Luna(Planetas[6],0.11,1.2,3.5,0xbbbbbb);
//Oberón
Luna(Planetas[6],0.09,1.6,2.5,0x777777);
//Neptuno
//Tritón
Luna(Planetas[7],0.14,1.4,3.0,0x76c7c0);

//Bucle de animación
function animate() {
	//Preparados para el próximo fotograma
	requestAnimationFrame( animate );

	//Modifica posición del cubo con traslación o rotación
	//esfera.position.x += 0.05;
	//Modifica orientación del cubo
	//esfera.rotation.x += 0.05;
	//esfera.rotation.y += 0.05;

	renderer.render( scene, camera );
}

function Planeta(nombre, radio, dist, vel, col, f1, f2, texture = undefined) {
  
  Esfera(0, 0, 0, radio, 32, 32, col, texture, true);
  
  let planeta = objetos[objetos.length - 1]; 

  planeta.visible = false;
  planeta.userData.nombre = nombre;
  planeta.userData.dist = dist;
  planeta.userData.speed = vel;
  planeta.userData.f1 = f1;
  planeta.userData.f2 = f2;

  planeta.userData.lineaOrbita = pintarOrbita(dist, f1, f2);

  planetasDiccionario[nombre] = planeta;

  Planetas.push(planeta);
}

function Nave(radio, dist, vel, f1, f2, col = 0xaaabbb) {

  Cubo(0, 0, 0, 0.2, 0.2, 0.2, col, undefined);

  let nave = objetos[objetos.length - 1]; 

  nave.userData.dist = dist;
  nave.userData.speed = vel;
  nave.userData.f1 = f1;
  nave.userData.f2 = f2;

  Naves.push(nave);
}

  function pintarOrbita(dist, f1, f2) {

    const curve = new THREE.EllipseCurve(0, 0,
      dist * f1, dist * f2, 
      0, Math.PI * 2, false, 0
    );

    const points2D = curve.getPoints(100);
    const points3D = points2D.map(p => new THREE.Vector3(p.x, p.y, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints( points3D );

    const material = new THREE.LineBasicMaterial({ 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.3
  });

    const lineaOrbita = new THREE.Line(geometry, material);
    lineaOrbita.visible = false;
    scene.add(lineaOrbita);
    return lineaOrbita;
  }

  function Luna(planeta, radio, dist, vel, col) {				
    var geom = new THREE.SphereGeometry(radio, 10, 10);
    var mat = new THREE.MeshBasicMaterial({ color: col});
    var luna = new THREE.Mesh(geom, mat);
    luna.userData.dist = dist;
    luna.userData.speed = vel;
  
    Lunas.push(luna);
    planeta.add(luna);
  };

//Utilizamos la funcion cubo para la nave

function Cubo(px, py, pz, sx, sy, sz, col, texture) {
    //Objeto cubo
    let geometry = new THREE.BoxGeometry(sx, sy, sz);
    let material = new THREE.MeshBasicMaterial({
      color: col
    });
  
    //Textura
    if (texture != undefined){
      material.map = texture;
    }
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(px, py, pz);
    //Objeto añadido a la escena
    scene.add(mesh);
    objetos.push(mesh);
  }

//Mezclamos las funciones de esfera y esferaPhong

  function Esfera(px, py, pz, radio, nx, ny, col, texture = undefined, sombra = false) {
    let geometry = new THREE.SphereGeometry(radio, nx, ny);
    
    let material;
    if (texture !== undefined) {
      material = new THREE.MeshPhongMaterial({ map: texture });
    } else {
      material = new THREE.MeshPhongMaterial({ color: col });
    }
  
    let mesh = new THREE.Mesh(geometry, material);
    if (sombra) mesh.castShadow = true;
    
    mesh.position.set(px, py, pz);
    scene.add(mesh);
    objetos.push(mesh);
  }

  function animationLoop() {
    timestamp = (Date.now() - t0) * accglobal;
  
    requestAnimationFrame(animationLoop);
  
    //Modifica rotación de todos los objetos
    Planetas.forEach(function (planeta) {
      planeta.position.x =
        Math.cos(timestamp * planeta.userData.speed) * planeta.userData.dist*planeta.userData.f1;
      planeta.position.y =
        Math.sin(timestamp * planeta.userData.speed) * planeta.userData.dist*planeta.userData.f2;
    });

    Naves.forEach(function (nave) {
      nave.position.x = Math.cos(timestamp * nave.userData.speed) * nave.userData.dist * nave.userData.f1;
      nave.position.y = Math.sin(timestamp * nave.userData.speed) * nave.userData.dist * nave.userData.f2;
    });

    for(let object of Lunas) {
			object.position.x = Math.cos(timestamp * object.userData.speed) * object.userData.dist;
      object.position.y = Math.sin(timestamp * object.userData.speed) * object.userData.dist;
		}

    if (camaraModo === "nave" && Naves.length > 0) {
      let miNave = Naves[0];

      camera.position.copy(miNave.position);
      camera.position.z += 0.4; 

      //Ponemos el mismo recorrdio para ver que la nave hace en su recorrido
      let tiempoFuturo = timestamp + 0.05; 
      let futuroX = Math.cos(tiempoFuturo * miNave.userData.speed) * miNave.userData.dist * miNave.userData.f1;
      let futuroY = Math.sin(tiempoFuturo * miNave.userData.speed) * miNave.userData.dist * miNave.userData.f2;
      
      camera.lookAt(futuroX, futuroY, miNave.position.z);
    }
  
    renderer.render(scene, camera);
  }

  document.querySelectorAll('.btn-planeta').forEach(boton => {
    boton.addEventListener('click', (e) => {
      let nombrePlaneta = e.target.getAttribute('data-target');
      
      let objetivo = planetasDiccionario[nombrePlaneta];
        
      if (objetivo) {
        objetivo.visible = true; 
        objetivo.userData.lineaOrbita.visible = true; 
          
        planetaObjetivo = objetivo; 
      }
    });
  });

  document.getElementById("btn-general").addEventListener("click", () => {
    camaraModo = "general";
  
    camera.position.set(0, 0, 70);
    camera.lookAt(0, 0, 0);
  });

  document.getElementById("btn-nave").addEventListener("click", () => {
    if (Naves.length > 0) {
      camaraModo = "nave";
    }
  });

animate();
animationLoop();
