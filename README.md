# Práctica: Simulador 3D del Sistema Planetario Interactivo con Three.js

**Autor:** Mencey Montesdeoca Álamo
**Asignatura:** Informática Gráfica

---

## Descripción
Este repositorio contiene el desarrollo de un simulador 3D interactivo del sistema solar implementado íntegramente en JavaScript utilizando la librería **Three.js** y ejecutado en un entorno web interactivo capaz de adjuntar los distintos planetas. El proyecto integra modelado de cuerpos celestes, iluminación dinámica con sombras, texturizado, órbitas circulares y elípticas personalizadas, órbitas de lunas, un panel de control y una modalidad de navegación en primera persona a bordo de una nave espacial.

---

## Tareas Desarrolladas

### Tarea 1: Arquitectura Base, Sol, Iluminación y Órbitas Elípticas
- **Descripción:** Configuración inicial del entorno gráfico 3D, el motor de renderizado WebGL, el grafo de escena y las leyes de movimiento orbital para el Sol y los planetas principales.
- **Metodología y Funcionamiento:**
  - Se configuró un `PerspectiveCamera` y un `WebGLRenderer` con soporte avanzado para sombras suaves (`PCFSoftShadowMap`).
  - Se implementó un sistema de iluminación dual compuesto por una luz ambiental tenue (`AmbientLight`) y una luz puntual central en el Sol (`PointLight`) que proyecta sombras reales (`castShadow = true`) sobre los planetas.
  - Las órbitas de los cuerpos celestes se calcularon mediante curvas paramétricas elípticas (`THREE.EllipseCurve`) utilizando factores de excentricidad ajustables ($f_1$ y $f_2$) mediante funciones trigonométricas de seno y coseno.
  - Se diseñó la función modularizada `Planeta` y la función unificada `Esfera`, soportando materiales fotorealistas de tipo `MeshPhongMaterial` compatibles con texturas externas o colores planos de respaldo.
- **Resultado:**
  *(Inserta aquí una captura de pantalla del sistema solar general)*

---

### Tarea 2: Sistema de Lunas Jerárquicas e Interfaz de Control Acumulativo
- **Descripción:** Creación y vinculación de lunas orbitando alrededor de sus respectivos planetas, junto con un panel de control HTML dinámico que permite mostrar los distintos planetas.
- **Metodología y Funcionamiento:**
  - Se programó la función `Luna`, aprovechando el grafo de escena de Three.js para hacer que cada satélite sea hijo directo del planeta correspondiente (`planeta.add(luna)`), heredando así su movimiento de traslación de forma automática.
  - Se desarrolló un panel lateral flotante con botones interactivos vinculados a un diccionario asociativo (`planetasDiccionario`), permitiendo activar y sumar planetas a la escena de manera progresiva sin eliminar los anteriores.
- **Resultado:**
  *(Inserta aquí una captura de pantalla seleccionando un planeta con sus lunas)*

---

### Tarea 3: Nave Espacial y Modos de Cámara Dinámicos ("Vista General" y "Vista Piloto")
- **Descripción:** Incorporación de una nave espacial interactiva dentro del sistema y un sistema de control de cámaras avanzado para alternar entre una vista panorámica global y una perspectiva de pilotaje en primera persona.
- **Metodología y Funcionamiento:**
  - Se creó un objeto de tipo caja tridimensional (`Cubo`) adaptado como nave espacial (`Nave`) con su propia órbita y velocidad asignada en el bucle de animación (`animationLoop`).
  - Se estructuró un selector de modos de cámara (`camaraModo`) gestionado por eventos de usuario:
    - **Vista General:** Eleva la cámara a una posición panorámica lejana ($z = 70$) centrada en el origen.
    - **Vista Nave / Piloto:** Coloca la cámara exactamente en la posición de la nave con una ligera elevación y aplica la función (`camera.lookAt`) para simular la vista frontal del piloto recorriendo el sistema solar.
- **Resultado:**
  *(Inserta aquí una captura de pantalla en la vista de la nave)*
