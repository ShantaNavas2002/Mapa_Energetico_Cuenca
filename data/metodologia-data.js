const DATA_METODOLOGIA = {
    bloques: [
      // ---------------- BLOQUE 1 CORREGIDO ----------------
        {
            // 1. Cabecera dividida
            seccion: "METODOLOGÍA",      // Va a la pastilla gris (Izquierda)
            fase: "Introducción",        // Va al texto claro (Derecha)
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Contexto Urbano", // <--- ESTO ES LO QUE HACE QUE SALGA EL TÍTULO FLOTANTE
                    contenido: `
                        <p>La transformación de las ciudades contemporáneas hacia modelos de sostenibilidad no es solo una cuestión de políticas macroeconómicas o grandes infraestructuras hidroeléctricas; reside, fundamentalmente, en la capacidad de empoderar al ciudadano común para convertirse en un actor activo del sistema energético. En el contexto de Cuenca, Ecuador, la morfología urbana presenta un "yacimiento solar" inexplorado en sus cubiertas [1]. </p>
                        <p>Sin embargo, la barrera principal para la adopción masiva de la energía fotovoltaica no es tecnológica, sino informativa. El ciudadano promedio desconoce si su techo es apto, cuánta energía puede generar y, crucialmente, cómo interactúa esta generación con la compleja estructura tarifaria local [2].</p>
                        <p>Esta metodológica presenta los procesos detallados desarrollados para construir una plataforma web educativa y funcional. El objetivo no es solo calcular los kWh, generados por el sistema fotovoltaico, sino traducir variables físicas complejas como la irradiancia difusa, la obstrucción de horizonte y las regresiones tarifarias, en una narrativa accesible que permita a los habitantes de la ciudad de Cuenca (de los sectores Ordóñez Lasso, Primero de Mayo y Totoracocha) tomar decisiones informadas sobre su futuro energético [1].</p>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "", // <--- TÍTULO FLOTANTE DERECHA
                    src: "images/ImgJson1.webp",
                    alt: "Fotografia"
                }
            ]
        },

        

      //2
    {
            seccion: "Metodología",
            fase: "Introducción",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Estructura Metodológica",
                    contenido: `
                        <p>La transformación de las ciudades contemporáneas hacia modelos de sostenibilidad no es solo una cuestión de políticas macroeconómicas o grandes infraestructuras hidroeléctricas; reside, fundamentalmente, en la capacidad de empoderar al ciudadano común para convertirse en un actor activo del sistema energético. En el contexto de Cuenca, Ecuador, la morfología urbana presenta un 'yacimiento solar' inexplorado en sus cubiertas.1</p>
                        
                        <p>Sin embargo, la barrera principal para la adopción masiva de la energía fotovoltaica no es tecnológica, sino informativa. El ciudadano promedio desconoce si su techo es apto, cuánta energía puede generar y, crucialmente, cómo interactúa esta generación con la compleja estructura tarifaria local.</p>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "texto",
                    tituloCaja: "",
                    contenido: `
                        <ol>
                            <li><strong>Definición Territorial:</strong> Selección estratégica de tejidos urbanos representativos basándose en índices de edificabilidad y verticalidad.</li>
                            
                            <li><strong>Levantamiento y Digitalización:</strong> Uso de vehículos aéreos no tripulados (VANT/Drones) con posicionamiento RTK para generar modelos digitales de superficie con precisión centimétrica.</li>
                            
                            <li><strong>Modelado y Calculo de Superficie Útil (S.U.): </strong> Reconstrucción tridimensional (LOD 2) y cálculo de radiación solar incidente considerando sombras propias y arrojadas por el entorno y determinación de la superficie útil neta.</li>
                            
                            <li><strong>Procesamiento y Análisis Económico:</strong> : Simulación solar, integración de patrones de consumo real, y aplicación de modelos de costos no lineales para sistemas On-Grid y Off-Grid.</li>
                        </ol>
                    `
                }
            ]
        },

        //3
        {
            seccion: "Metodología",
            fase: "Fase 1: Definición de los Sectores de Estudio",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Criterios de Selección",
                    contenido: `
                        <p>Para que los resultados de un estudio de potencial solar sean extrapolables y didácticos, la selección de las áreas de muestra no puede ser aleatoria. Se debe capturar la heterogeneidad de la ciudad.</p>
                        
                        <p>Siguiendo los criterios urbanísticos establecidos por Rueda-Palenzuela (2019), se definieron áreas de análisis ("supermanzanas") de aproximadamente 16 hectáreas, lo que permite un equilibrio entre detalle predial y relevancia estadística.1</p>
                        
                        <p>La variable rectora para esta selección fue el Índice de Edificabilidad y el nivel de Verticalidad. Estos factores determinan no solo la densidad de consumo energético por metro cuadrado de suelo, sino también la complejidad de las sombras urbanas ("canibalismo solar" entre edificios) y la disponibilidad per cápita de superficie de cubierta.1</p>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson3.png",
                    alt: "Análisis solar"
                }
            ]
        },

        // 4
        {
            seccion: "Metodología",
            fase: "Fase 1: Definición de los Sectores de Estudio",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Análisis Morfológico de los Sectores <br>Sector S1: Ordóñez Lasso – La Verticalidad</br>",
                    
                    contenido: `
                        
                        
                        <p>Este sector, con una superficie de 16,87 hectáreas, representa la modernidad vertical de Cuenca. Se ubica a lo largo de un eje vial estructurante de crecimiento lineal.1</p>
                        
                        <ol>
                            <li><strong>Caracterización Urbana:</strong> Predominan las edificaciones en altura, resultado de un alto índice de edificabilidad. Es una zona en proceso de consolidación donde torres residenciales modernas coexisten con remanentes de viviendas unifamiliares.1</li>
                            
                            <li><strong>Implicación Energética:</strong> Este es el escenario más desafiante para la energía solar. Aunque los edificios son altos y tienen acceso directo al sol, la relación entre el área de techo disponible y la demanda energética acumulada (docenas de departamentos apilados) es crítica. Además, las sombras proyectadas por las torres sobre los predios vecinos son significativas, lo que exige simulaciones de radiación avanzadas para no sobreestimar el potencial.1</li>
                            
                            <li><strong>Perfil del Usuario:</strong> Consumidores con alta demanda concentrada, ideales para sistemas comunitarios o análisis de suficiencia crítica.</li>
                        </ol>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson4.webp",
                    alt: "Mapa Ordoñez Lasso",
                    sinSombra: true
                }
            ]
        },

        // 5
        {
            seccion: "Metodología",
            fase: "Fase 1: Definición de los Sectores de Estudio",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Análisis Morfológico de los Sectores <br>Sector S2: Primero de Mayo – La Heterogeneidad alto-bajo.</br>",
                    contenido: `
                        
                        
                        <p>Con 16,96 hectáreas, este sector ilustra la mixticidad urbana típica de las ciudades latinoamericanas en expansión. Presenta un nivel intermedio de edificabilidad y verticalidad.</p>
                        
                        <ol>
                            <li><strong>Caracterización Urbana:</strong> Se define por un tejido mixto donde tipologías verticales de altura media conviven con construcciones de baja escala. No es ni plenamente residencial bajo ni corporativo alto; es un híbrido.</li>
                            
                            <li><strong>Implicación Energética:</strong> Este es el escenario más desafiante para la energía solar. Aunque los edificios son altos y tienen acceso directo al sol, la relación entre el área de techo disponible y la demanda energética acumulada (docenas de departamentos apilados) es crítica. Además, las sombras proyectadas por las torres sobre los predios vecinos son significativas, lo que exige simulaciones de radiación avanzadas para no sobreestimar el potencial.1</li>
                            
                            <li><strong>Perfil del Usuario:</strong> Una mezcla de viviendas unifamiliares y pequeños condominios, con perfiles de consumo variados.</li>
                        </ol>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson5.webp",
                    alt: "Primero de Mayo",
                    sinSombra: true
                }
            ]
        },

        // 6
        {
            seccion: "Metodología",
            fase: "Fase 1: Definición de los Sectores de Estudio",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Análisis Morfológico de los Sectores <br> Sector S3: Totoracocha – El Potencial Residencial Consolidado</br>",
                    contenido: `
                        
                        
                        <p>El sector Totoracocha, con 11,08 hectáreas, representa el tejido residencial tradicional y planificado de Cuenca.1</p>
                        
                        <ol>
                            <li><strong>Caracterización Urbana:</strong> Refleja un bajo índice de edificabilidad, caracterizado por una traza urbana definida y viviendas unifamiliares o bifamiliares de baja altura (1-3 pisos). Es un entorno consolidado con poca variación en la altura de los edificios.1</li>
                            
                            <li><strong>Implicación Energética:</strong> Este es el escenario ideal para la generación distribuida. La ausencia de grandes obstrucciones verticales y la baja densidad habitacional por predio resultan en una excelente disponibilidad de techo por habitante. Las sombras son mínimas y predecibles.1</li>
                            
                            <li><strong>Perfil del Usuario:</strong> Familias con consumo moderado y gran superficie disponible, candidatos perfectos para la autosuficiencia total (Net Zero).1</li>
                        </ol>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson6.webp",
                    alt: "Mapa Totoracocha",
                    sinSombra: true
                }
            ]
        },

        // 7
        {
            seccion: "Metodología",
            fase: "Fase 2: Levantamiento y Digitalización",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Fundamentos de la Fotogrametría Aérea",
                    contenido: `
                        <p>Para evaluar el potencial solar con precisión, los mapas satelitales convencionales (como Google Earth) son insuficientes debido a su baja actualización y falta de detalle tridimensional. La metodología adoptada emplea la fotogrametría digital, una técnica que reconstruye la geometría 3D de objetos y terrenos a partir de la superposición de imágenes bidimensionales.18</p>
                        
                        <p>La premisa didáctica para el usuario web es entender esto como un "escaneo 3D desde el cielo". El dron captura miles de fotos desde diferentes ángulos; el software identifica puntos comunes en esas fotos (como la esquina de una ventana o la punta de una chimenea) y, mediante triangulación matemática, calcula su posición exacta en el espacio. El resultado es una "nube de puntos" que replica la ciudad con precisión milimétrica.1</p>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "carrusel",
                    tituloCaja: "Galería de Mapas", // Título opcional
                        imagenes: 
                        [
                            { src: "images/ImgJson7.webp", alt: "Mapa 1" },
                            { src: "images/ImgJson7.1.webp", alt: "Mapa 2" },
                            { src: "images/ImgJson7.2.webp", alt: "Mapa 3" },
                            { src: "images/ImgJson7.3.webp", alt: "Mapa 4" },
                            { src: "images/ImgJson7.4.webp", alt: "Mapa 5" }
                        ]
                }
            ]
        },

        // 8
        {
            seccion: "Metodología",
            fase: "Fase 2: Levantamiento y Digitalización",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Protocolo de Adquisición de Datos",
                    contenido: `
                        <p>La calidad del modelo digital depende intrínsecamente de la calidad de la captura. Se utilizaron equipos de grado topográfico para garantizar la fidelidad de los datos.1</p>
                        
                        <ul>
                            <li><strong>Plataforma Aérea:</strong> Dron DJI Matrice 300 RTK. La inclusión de tecnología RTK (Real-Time Kinematic) es crucial, ya que corrige la posición GPS del dron en tiempo real usando una base en tierra, reduciendo el error de posición de varios metros (GPS estándar) a centímetros.1</li>
                            
                            <li><strong>Sensor Óptico:</strong> Cámara Zenmuse P1 con sensor full-frame de 45 MP y lente de 35mm. Un sensor más grande captura más luz y detalle, permitiendo identificar pequeños obstáculos en los techos (ej. tuberías de ventilación) que serían invisibles para cámaras menores.1</li>
                            
                            <li><strong>Parámetros de Vuelo:</strong>
                                <ul>
                                    <li>Altura: 100 metros sobre el nivel del terreno.</li>
                                    <li>GSD (Ground Sampling Distance): ~2 cm/píxel. Esto significa que cada píxel en la imagen final representa un cuadrado de 2x2 cm en el mundo real, una resolución extremadamente alta para análisis urbano.1.</li>
                                    <li>Solapamiento (Overlap): 70% frontal y 60% lateral. Este alto grado de redundancia es necesario para que los algoritmos de fotogrametría eviten "huecos" en el modelo 3D.1</li>
                                </ul>
                            </li>
                        </ul>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson8.png",
                    alt: "Dron DJI"
                }
            ]
        },

        // 9
        {
            seccion: "Metodología",
            fase: "Fase 2: Levantamiento y Digitalización",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Procesamiento: De la Imagen a la Nube de Puntos",
                    contenido: `
                        <p>El flujo de trabajo digital se realizó en el software especializado Agisoft Metashape, siguiendo una secuencia lógica de reconstrucción 1:</p>
                        
                        <ol>
                            <li><strong>Alineación de Fotos:</strong> El software analiza las miles de imágenes para encontrar "puntos de enlace" y determinar la posición exacta de la cámara en cada disparo.</li>
                            
                            <li><strong>Nube de Puntos Densa:</strong> Se genera una nube masiva de puntos coloreados (millones de puntos) que representan la superficie de la ciudad. Para el usuario, esto se explica como una pintura puntillista en 3D de su barrio.1</li>
                            
                            <li><strong>Modelo Digital de Superficie (MDS):</strong> Se crea una malla geométrica continua (TIN - Triangulated Irregular Network) que conecta los puntos. A diferencia de un Modelo Digital del Terreno (MDT) que solo muestra el suelo, el MDS incluye casas, árboles y muros, elementos vitales para calcular sombras.1</li>
                            
                            <li><strong>Ortofoto:</strong> Una imagen aérea libre de distorsiones de perspectiva, georreferenciada con exactitud (± 3 cm horizontal, ± 5 cm vertical), que sirve como mapa base para la verificación visual.1</li>
                            
                            <li><strong>Generación del DEM (Rasterizado):</strong> Finalmente, se convierte la información 3D en un mapa de elevaciones matricial (GeoTIFF). A diferencia de la malla visual (Paso 3), el DEM (Digital Elevation Model) funciona como una "hoja de cálculo espacial" donde cada píxel almacena un valor numérico exacto de altura.</li>
                        </ol>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson9.webp",
                    alt: "Software Metashape"
                }
            ]
        },

    // 10
        {
            seccion: "Metodología",
            fase: "Fase 3: Modelado 3D y Cálculo de Superficie Útil",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Abstracción Geométrica LOD 2",
                    contenido: `
                        <p>Una vez obtenida la nube de puntos, se procedió a la modelación de las edificaciones en el software DesignBuilder v6.1. Se optó por un nivel de detalle LOD 2 (Level of Detail 2).</p>
                        
                        <ul>
                            <li><strong>Concepto Didáctico:</strong> Mientras que un modelo LOD 1 representa los edificios como simples cajas (cubos), el LOD 2 detalla la estructura del techo: sus inclinaciones, cumbreras, limatesas y aleros.1</li>
                            
                            <li><strong>Relevancia:</strong> Un panel solar instalado en un techo plano recibe radiación de manera muy diferente a uno en un techo inclinado hacia el sur. Ignorar la pendiente del techo resultaría en cálculos energéticos erróneos. El modelo excluyó vegetación temporal y vehículos, pero conservó rigurosamente las obstrucciones permanentes.1</li>
                        </ul>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson10.webp",
                    alt: "Logo DesignBuilder"
                }
            ]
        },

        // 11
        {
            seccion: "Metodología",
            fase: "Fase 3: Modelado 3D y Cálculo de Superficie Útil",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Cálculo de Superficie Útil",
                    contenido: `
                        <p>Uno de los aportes metodológicos más importantes de este estudio es la distinción entre "área de techo" y "área útil". No todo el techo es apto para paneles solares. La metodología define la Superficie Útil Su mediante una ecuación de sustracción que elimina áreas ineficientes u ocupadas.1</p>
                        
                        <p>La ecuación aplicada a cada predio es: (Mirar recuadro de la derecha)</p>
                        
                        <p>Donde los componentes positivos son las superficies de cubierta orientadas a los puntos cardinales (Norte, Sur, Este, Oeste) y Plana. Los componentes negativos, que se restan, son 1:</p>
                        
                        <ul>
                            <li><strong>S1 (Superficies Vidriadas):</strong> Tragaluces, claraboyas y entradas de luz cenital. Cubrirlas oscurecería el interior de la vivienda.</li>
                            <li><strong>S2 (Obstáculos Volumétricos):</strong> Elementos que ocupan espacio físico y proyectan sombra local, como chimeneas, tanques de reserva de agua, casetas de ascensores, antenas y unidades de aire acondicionado.1</li>
                            <li><strong>S3 (Geometría Compleja):</strong> Fragmentos de cubierta resultantes de intersecciones complicadas (limahoyas agudas) donde es físicamente imposible instalar un módulo.</li>
                        </ul>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "texto",
                    tituloCaja: "",
                    centrado: true,
                    contenido: `
                        <div style="text-align: center; padding: 20px; border: 2px solid var(--color-primario); border-radius: 10px;">
                            <h3 style="margin-bottom: 10px;">Ecuación</h3>
                            <p style="font-size: 1.2rem; font-weight: bold;">Su = (Cn + Cs + Ce + Co + Cp) - (S1 + S2 + S3)</p>
                        </div>
                    `
                }
            ]
        },

        // 12
        {
            seccion: "Metodología",
            fase: "Fase 4.1 : Simulación Energética y Estimación Solar",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "El Sol Virtual: Datos Climáticos y Simulación",
                    contenido: `
                        <p>Con los sectores reconstruidos digitalmente y depurados, el siguiente paso fue simular el comportamiento del sol sobre estas superficies. Se utilizaron archivos climáticos EPW (EnergyPlus Weather) específicos para Cuenca (Latitud -2.90°, Longitud -79.00°), actualizados al año 2024 con datos de la estación meteorológica El Batán [1].</p>
                        
                        <p><strong>Temporalidad:</strong> Se ejecutaron 12 simulaciones independientes, una para cada mes del año. Esto es fundamental porque la posición del sol varía estacionalmente (solsticios y equinoccios) y, más importante aún, la nubosidad en Cuenca cambia a lo largo del año. Un promedio anual ocultaría los déficits de energía en meses nublados.<sup>1</sup></p>
                        
                        <p><strong>Irradiación Global:</strong> El modelo calcula la radiación solar global acumulada (kWh/m2), que es la suma de la radiación directa (rayos de sol directos), difusa (luz dispersa por las nubes) y reflejada (luz que rebota en otros edificios).<sup>29</sup></p>
                        
                        <p><strong>Sombreado Contextual:</strong> El software considera las sombras que los edificios vecinos proyectan entre sí hora a hora. En el sector Ordóñez Lasso, esto reveló pérdidas significativas de potencial en los pisos inferiores de las torres.<sup>1</sup></p>
                    
                        <strong>Identificación de la Orientación Óptima (Hsp)</strong>

                        <p>Para cada predio, se analizó cuál de las orientaciones de cubierta recibía la mayor irradiación acumulada.</p>

                        <ul>
                            <li><strong>Horas Sol Pico (Hsp):</strong> Se convirtió la energía total en "Horas Sol Pico", una unidad estándar en la industria que representa el número de horas equivalentes en las que el sol brilla a una intensidad de 1000 W/m2. Para Cuenca, este valor oscila alrededor de las 3.5 a 4.5 horas dependiendo de la micro-ubicación y sombras.1</li>
                        </ul>
                        `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson12.webp",
                    alt: "Ilustración Simulación"
                }
            ]
        },

        // 13
        {
            seccion: "Metodología",
            fase: "Fase 4.2: Dimensionamiento del Sistema FV",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Selección del Panel",
                    contenido: `
                        
                        <p>Para traducir la radiación solar (clima) en electricidad (servicio), se debe definir un hardware de referencia. El estudio seleccionó un módulo fotovoltaico que representa el estándar actual del mercado local:</p>
                    `
                },
                {
                    tipo: "tabla",
                    
                    headers: ["Parámetro", "Valor", "Justificación"],
                    filas: [
                        ["Tecnología", "Monocristalino", "Mayor eficiencia por m2, ideal para techos urbanos limitados."],
                        ["Potencia (Wp)", "540 W", "Potencia alta que reduce la cantidad de cableado y anclajes."],
                        ["Dimensiones", "2.279 x 1.134 m", "Área de ~2.59 m2. Define el 'pixel' mínimo de instalación"],
                        ["Eficiencia", "Células Half-Cell", "Mejor comportamiento ante sombras parciales y calor."],
                        ["Resistencia", "IP68", "Apto para soportar las lluvias intensas de Cuenca."]
                    ]
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "texto",
                    tituloCaja: "Cálculo de Paneles Requeridos",
                    contenido: `
                        <p>La metodología garantiza la seguridad energética del usuario. Por tanto, se dimensiona el sistema para el consumo promedio mensual registrado en el año (E).</p>
                        
                        <p>La fórmula utilizada es:</p>
                        
                        <div style="text-align: center; margin: 15px 0;">
                            <h2>Npaneles = (E x 1.30) / (Hps x Wp)</h2>
                        </div>
                        
                        <ul>
                            <li><strong>E:</strong> Consumo de energía diario promedio por mes dentro del año (kWh).</li>
                            <li><strong>Hps:</strong> Horas sol pico promedio del emplazamiento.</li>
                            <li><strong>Wp:</strong> Potencia pico del panel (0.54 kW).</li>
                            <li><strong>1.30 (Factor de Pérdidas):</strong> Este es un dato clave de honestidad técnica. Se asume que el sistema perderá un 30% de su energía teórica debido a: suciedad en los paneles (polvo/smog), calentamiento del cableado (efecto Joule), eficiencia del inversor (conversión DC/AC) y degradación natural. Esto evita promesas de rendimiento irreales en la página web.1</li>
                        </ul>
                    `
                }
            ]
        },

        // 14
        {
            seccion: "Metodología",
            fase: "Fase 4.2: Dimensionamiento del Sistema FV",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Índice de Suficiencia Fotovoltaica (ISF)",
                    contenido: `
                        <p>La transformación de las ciudades contemporáneas hacia modelos de sostenibilidad no es solo una cuestión de políticas macroeconómicas o grandes infraestructuras hidroeléctricas; reside, fundamentalmente, en la capacidad de empoderar al ciudadano común para convertirse en un actor activo del sistema energético. En el contexto de Cuenca, Ecuador, la morfología urbana presenta un 'yacimiento solar' inexplorado en sus cubiertas.1</p>
                        
                        <p>Sin embargo, la barrera principal para la adopción masiva de la energía fotovoltaica no es tecnológica, sino informativa. El ciudadano promedio desconoce si su techo es apto, cuánta energía puede generar y, crucialmente, cómo interactúa esta generación con la compleja estructura tarifaria local.</p>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "texto",
                    tituloCaja: "",
                    contenido: `
                        <p><strong>Interpretación para el Usuario:</strong></p>
                        
                        <p style="color: green; font-weight: bold;">ISF ≤ 1 (Verde): Suficiencia Total.</p>
                        <p>Tu techo es lo suficientemente grande para cubrir el 100% de tu consumo máximo.</p>
                        
                        <p style="color: red; font-weight: bold;">ISF > 1 (Rojo): Insuficiencia.</p>
                        <p>Tu consumo es demasiado alto para el espacio disponible en tu techo. Necesitas priorizar la eficiencia energética antes de instalar paneles o aceptar una cobertura parcial.1</p>
                    `
                },
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson15.png",
                    alt: "Ilustración ISF"
                }
            ]
        },
    
        // 15
        {
            seccion: "Metodología",
            fase: "Fase 4.3: Análisis Tarifario",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Consumo Energético:<br>El Medidor como Unidad de Análisis",
                    contenido: `
                        
                        
                        <p>Se trabajó con datos de consumo real proporcionados por Centrosur para el periodo Julio 2024 – Junio 2025.</p>
                        
                        <ul>
                            <li><strong>Procesamiento:</strong> Se sumaron los consumos de todos los medidores asociados a un mismo predio catastral. Esto es vital en edificios de departamentos (Propiedad Horizontal), donde el techo es un bien común que debe abastecer a múltiples medidores.</li>
                            <li><strong>Supuesto de Vivienda:</strong> Ante la falta de datos censales, se validó la densidad habitacional asumiendo 1 Medidor = 1 Unidad Habitacional, visualizado mediante mapas de densidad de puntos (Dot Density) que muestran intuitivamente dónde se concentra la demanda.1</li>
                        </ul>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "texto",
                    tituloCaja: "Estructura Tarifaria y Costos ´Ocultos´",
                    contenido: `
                        <h3>Estructura Tarifaria y Costos "Ocultos"</h3>
                        <p>La rentabilidad solar no depende solo de cuánta energía produces, sino de cuánto dejas de pagar. La metodología desglosó la planilla eléctrica de Cuenca para identificar los ahorros reales y los costos inevitables.1</p>
                        
                        <p><strong>Componentes Variables (Ahorrables)</strong></p>
                        <ul>
                            <li><strong>Energía Activa:</strong> Depende del consumo. Se consideró el escalón tarifario:
                                <ul>
                                    <li>Tarifa Dignidad: Para consumos < 100 kWh/mes (~$0.05/kWh).</li>
                                    <li>Tarifa General: Para consumos > 100 kWh/mes (~$0.10/kWh).</li>
                                </ul>
                            </li>
                            <li><strong>Alumbrado Público:</strong> Calculado como un porcentaje del consumo (11.76% para tarifa general). Al bajar el consumo con paneles, este rubro también baja.1</li>
                        </ul>
                        
                        <p><strong>Componentes Fijos (No Ahorrables)</strong></p>
                        <p>Incluso con paneles solares, el usuario seguirá pagando:</p>
                        <ul>
                            <li><strong>Comercialización:</strong> ~$1.41 USD.</li>
                            <li><strong>Tasa de Bomberos:</strong> ~$2.35 USD (Variable según normativa local, pero fijo para el usuario residencial promedio).1</li>
                        </ul>
                        
                        <p><strong>La Tasa de Recolección de Basura</strong></p>
                        <p>En Ecuador para el diciembre de 2025 la tasa de aseo y recolección de basura se deja de cobrar en la planilla de luz. Por tanto se ha obviado su consideración dentro de estas tasas.</p>
                    `
                }
            ]
        },

        // 16
        {
            seccion: "Metodología",
            fase: "Fase 4.4: Modelado de Costos de Instalación",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Sistemas ON-Grid (Conectados a la Red)",
                    contenido: `
                        <p>La transformación de las ciudades contemporáneas hacia modelos de sostenibilidad no es solo una cuestión de políticas macroeconómicas o grandes infraestructuras hidroeléctricas; reside, fundamentalmente, en la capacidad de empoderar al ciudadano común para convertirse en un actor activo del sistema energético. En el contexto de Cuenca, Ecuador, la morfología urbana presenta un 'yacimiento solar' inexplorado en sus cubiertas.1</p>
                        
                        <p>Sin embargo, la barrera principal para la adopción masiva de la energía fotovoltaica no es tecnológica, sino informativa. El ciudadano promedio desconoce si su techo es apto, cuánta energía puede generar y, crucialmente, cómo interactúa esta generación con la compleja estructura tarifaria local.</p>
                    `
                },
                {
                    tipo: "tabla",
                    tituloCaja: "",
                    headers: ["Paneles", "Límite INF Wp", "Límite SUP Wp", "Fórmula"],
                    filas: [
                        ["1 A 35", "540", "18,900", "5.023432 * Wp <sup>0.808891</sup>"],
                        ["36 A 300", "19,440", "162,000", "1*1E-11*Wp<sup>2</sup> - 3*1E-6*Wp + 0.9646"],
                        ["300<", "162,540", "540,540", "0.74"]
                    ]
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson17.webp",
                    alt: "Esquema de conexión Sistema"
                }
            ]
        },

        // 17
        {
            seccion: "Metodología",
            fase: "Fase 4.4: Modelado de Costos de Instalación",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Sistemas OFF-Grid (Con Baterías)",
                    contenido: `
                        <p>Los sistemas Off-Grid, al requerir almacenamiento de energía para operar de noche o durante cortes de luz, presentan un comportamiento de costos más complejo y no lineal. El dimensionamiento de las baterías (Wh) no siempre crece en la misma proporción que los paneles (Wp). De este modo se tienen 4 rangos, uno creado con los datos conocidos y 3 basados en una proporción a los rangos de la sección ON-Grid.</p>
                        
                        <p><strong>Rango 1:</strong> Para este rango, se construyó una base de datos con costos reales de 23 proyectos instalados, abarcando sistemas desde 540 Wp hasta 13,920 Wp (1 a 26 paneles), se desarrolló una regresión cuadrática multivariable que relaciona la potencia instalada (Wp) y la capacidad de almacenamiento (Wh). El modelo presenta un R2 > 0.97. Además, se estimó una relación promedio de 1.97 Wh de almacenamiento por cada Wp de generación.1</p>
                        
                        <p><strong>Rangos 2, 3 y 4:</strong> Para sistemas mayores a 26 paneles, donde los datos de mercado son escasos, se calculó una relación de precio constante. Se determinó que, en promedio, un sistema con baterías cuesta 1.93 veces más que su equivalente On-Grid. Este factor se aplica a las fórmulas ya validadas del sistema On-Grid para proyectar los costos en escalas mayores.1</p>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson18.webp",
                    alt: "Análisis solar Off-Grid"
                }
            ]
        },

        // 18
        {
            seccion: "Metodología",
            fase: "Fase 4.4: Modelado de Costos de Instalación",
            contenidoIzquierda: [
                {
                    tipo: "tabla",
                    tituloCaja: "Sistemas OFF-Grid (Con Baterías)",
                    headers: ["Rango (Paneles)", "Rango Potencia (Wp)", "Método de cálculo", "Fórmula/Valor aplicado", "Explicación"],
                    filas: [
                        ["1 - 26", "540 - 13,920", "Regresión Cuadrática", "USD = 1.68⋅Wp + 1.33⋅10<sup>-5</sup>⋅Wp<sup>2</sup> + 660", "\"El Modelo Preciso\": Basado en facturas reales. Incluye un costo base de arranque ($660) y ajusta el precio de las baterías con alta precisión."],
                        ["27 - 35", "14,460 - 18,900", "Proyección Proporcional", "Costo OnGrid x 1.93", "\"El Modelo Escalonado\": Aplica el factor de sobrecosto de baterías (1.93) a las fórmulas ya establecidas para sistemas On-Grid."],
                        ["36 - 300", "19,440 - 162,000", "Proyección Proporcional", "Costo OnGrid x 1.93", "\"El Modelo Escalonado\": Mismo criterio proporcional."],
                        ["<300", "> 162,000", "Valor Fijo", "Costo OnGrid x 1.93", "\"El Modelo Escalonado\": Para grandes escalas."]
                    ]
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson18.webp",
                    alt: "Esquema Off grid"
                }
            ]
        },

    // 19
        {
            seccion: "Metodología",
            fase: "Fase 4.5: Cálculo del retorno de inversión y ahorro anual",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Retorno de la Inversión",
                    contenido: `
                        
                        <p>Una vez definidas las tasas fijas mandatorias y los costos de instalación según la potencia (Wp) del sistema, se procede a calcular el retorno de la inversión. Para ello, se establece un balance anual donde el "ingreso" corresponde al monto del consumo eléctrico anual por predio (basado en datos de CENTROSUR) y el "egreso" equivale a las tasas fijas mensuales multiplicadas por doce.</p>
                        
                        <p>La variable determinante, el costo total del sistema, se obtiene considerando los Wp mínimos requeridos, calculados a partir del consumo promedio de kWh del último año y la radiación de la cubierta más óptima, vistos en secciones anteriores. Finalmente, el tiempo de retorno en años se obtiene dividiendo el costo total del sistema para el flujo neto anual (Ahorro Anual menos Egresos por tasas fijas).</p>
                    `
                },
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson20.png",
                    alt: "Fórmula Retorno Inversión"
                },
                {
                    tipo: "texto",
                    tituloCaja: "",
                    contenido: `
                        <p>Donde:</p>
                        <ul>
                            <li><strong>Tr:</strong> Tiempo de retorno de la inversión expresado en años.</li>
                            <li><strong>Csistema:</strong> Costo total de instalación del sistema fotovoltaico (USD), derivado de los Wp requeridos según el consumo histórico y la radiación de la cubierta óptima.</li>
                            <li><strong>Panual:</strong> Pago anual estimado basado en el historial de planillas (USD).</li>
                            <li><strong>Tfija:</strong> Tasas fijas mandatorias mensuales que permanecen como costo operativo (USD).</li>
                        </ul>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "texto",
                    tituloCaja: "Ahorro anual",
                    contenido: `
                        
                        <p>Cuando la inversión ya se ha solventado de acuerdo al número de años estimados para el retorno de la inversión, se procede a calcular el ahorro anual del usuario por el sistema instalado. Para este proceso se resta el Pago anual del último año menos las tasas fijas mandatorias por 12 meses, este valor se expresa en USD/año.</p>
                    `
                },
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson20-1.png",
                    alt: "Fórmula Ahorro Anual"
                },
                {
                    tipo: "texto",
                    tituloCaja: "",
                    contenido: `
                        <p>Donde:</p>
                        <ul>
                            <li><strong>Aanual:</strong> Ahorro anual en (USD).</li>
                            <li><strong>Panual:</strong> Pago anual estimado basado en el historial de planillas (USD).</li>
                            <li><strong>Tfija:</strong> Tasas fijas mandatorias mensuales que permanecen como costo operativo (USD).</li>
                        </ul>
                    `
                }
            ]
        },

        // 20
        {
            seccion: "Metodología",
            fase: "Visualización de Resultados",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Estimación de alturas edificadas y número de pisos por predio",
                    contenido: `
                        <p>La estimación de alturas edificadas y número de pisos se realizó a partir de la integración de modelos digitales derivados de fotogrametría y análisis espacial sobre la cartografía catastral. El procedimiento se desarrolló en cuatro etapas principales: generación del modelo de alturas (nDSM), cálculo de estadísticas zonales por predio, definición del criterio de conversión de altura a número de pisos, y vinculación de los resultados a la capa de predios.</p>
                        
                        <h3>Generación del Modelo Digital de Alturas (nDSM)</h3>
                        <p>A partir de la nube de puntos densa clasificada en Metashape se generaron dos modelos:</p>
                        <ul>
                            <li>(a) un Modelo Digital del Terreno (DTM), empleando únicamente la clase Ground;</li>
                            <li>(b) un Modelo Digital de Superficie (DSM), utilizando la clase building.</li>
                        </ul>
                        
                        <p>Ambos modelos fueron exportados en formato GeoTIFF y posteriormente integrados en ArcGIS Pro. El Modelo Digital de Alturas (nDSM), por sus siglas en inglés (normalized Digital Surface Model) se obtuvo mediante la resta:</p>
                        
                        <h3 style="text-align:center; margin: 15px 0;">nDSM = DSM - DTM</h3>
                        
                        <p>Este raster representa exclusivamente la altura relativa de las edificaciones y otros objetos situados sobre el terreno natural.</p>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson21.webp",
                    alt: "Ilustración nDSM"
                }
            ]
        },

        // 21
        {
            seccion: "Metodología",
            fase: "Visualización de Resultados",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Cálculo de estadísticas de altura por predio (Zonal Statistics)",
                    contenido: `
                        
                        <p>Con el nDSM calculado, se empleó la herramienta Zonal Statistics as Table de ArcGIS Pro para obtener, para cada predio, un conjunto de métricas de altura. Se utilizó como campo identificador el código del predio.</p>
                        
                        <p>Las estadísticas generadas fueron:</p>
                        <ul>
                            <li>Altura máxima (MAX)</li>
                            <li>Altura media (MEAN)</li>
                            <li>Altura mínima (MIN)</li>
                            <li>Mediana (MEDIAN)</li>
                            <li>Desviación estándar (STD)</li>
                            <li>Percentil 90 (PCT90)</li>
                        </ul>
                        
                        <p>El percentil 90 se incluyó debido a su utilidad para representar la altura dominante de un edificio eliminando valores atípicos como chimeneas, antenas o ruido fotogramétrico. Esta métrica es frecuentemente empleada en estudios urbanos porque refleja con mayor fidelidad la masa edificada sin sobreestimar alturas por puntos aislados elevados.</p>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "texto",
                    tituloCaja: "Integración de alturas por predio y cálculo del número de pisos",
                    contenido: `
                        <h3>Integración de alturas por predio y cálculo del número de pisos</h3>
                        <p>La tabla de estadísticas se unió a la capa de predios mediante un Join utilizando el campo de identificación común. Una vez integrada la información, se procedió a calcular la altura representativa y el número de pisos por predio.</p>
                        
                        <p>Para definir el número de pisos se empleó inicialmente una altura promedio por piso de 3.20 m, estimada mediante la revisión manual de predios con alturas conocidas. El cálculo se realizó según:</p>
                    `
                },
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson22.png",
                    alt: "Fórmula Pisos"
                },
                {
                    tipo: "texto",
                    tituloCaja: "",
                    contenido: `
                        <p>y de manera equivalente con la Mediana o el Percentil 90:</p>
                    `
                },
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson22-1.png",
                    alt: "Fórmula Percentil"
                },
                {
                    tipo: "texto",
                    tituloCaja: "",
                    contenido: `
                        <p>No obstante, para evitar sobreestimaciones y dado que en viviendas bajas el perfil volumétrico puede presentar variaciones, se aplicó un criterio ajustado:</p>
                        <ol>
                            <li>Si el valor fraccionario era menor a 0.70, se conserva el piso inferior.</li>
                            <li>Si era mayor o igual a 0.70, se redondea al siguiente entero.</li>
                        </ol>
                        
                        <p>Este ajuste permite obtener una clasificación más coherente con la volumetría real y con la altura característica de viviendas de dos o tres niveles.</p>
                        
                        <h3>Exportación final de resultados y verificación espacial</h3>
                        <p>Finalmente, la capa con los campos de altura y número de pisos se exportó como una nueva entidad vectorial, garantizando que los atributos quedaran integrados de manera permanente. Se verificó visualmente la coherencia espacial de los valores asignados mediante superposición con el nDSM y la ortofoto, identificando posibles casos de ruido o errores asociados a arbolado o edificaciones con techos inclinados.</p>
                    `
                }
            ]
        },

        // 22
        {
            seccion: "Metodología",
            fase: "Visualización de Resultados",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "El potencial máximo instalable por cubierta",
                    contenido: `
                        <p>Una vez obtenidos los resultados gráficos, se procede a elaborar un gráfico de barras que presenta, por un lado, el consumo por mes de cada predio (con datos obtenidos de la CENTROSUR), otra barra muestra la cantidad de energía mínima recomendada a instalar obtenida en secciones anteriores y la barra final presenta el potencial máximo instalable en las cubiertas de cada predio.</p>
                        
                        <p>Este valor fue calculado de acuerdo al área útil de cada cubierta por orientación obtenido en la Fase III. Se divide el área útil de cada una de las 5 cubiertas (Norte, Sur, Este, Oeste y Plana) para el área de cada panel (Para este caso el panel utilizado de 540w tiene una superficie de ~2.59 m2). Este valor nos entrega el número total de paneles a instalarse dentro de las cubiertas de cada predio.</p>
                        
                        <p>Además, debido a que cada orientación presenta su radiación especifica, se multiplica el número de paneles por orientación por la radiación análoga a la orientación especifica y por la potencia del panel. Este valor nos entrega los kWh generados por cada orientación de cubierta. Finalmente, una vez calculado el potencial de cada una de las orientaciones en toda la cubierta, se procede a sumar cada una de estas potencias. Este valor final representa el potencial FV máximo que cada cubierta de cada predio puede generar.</p>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson23.png",
                    alt: "Fórmula Potencial Máximo"
                },
                {
                    tipo: "texto",
                    tituloCaja: "",
                    contenido: `
                        <p>Donde:</p>
                        <ul>
                            <li><strong>E_max:</strong> Energía máxima generada por el predio (kWh).</li>
                            <li><strong>A_(util_i):</strong> Área útil de la cubierta en la orientación i (Norte, Sur, Este, Oeste, Plana).</li>
                            <li><strong>A_panel:</strong> Superficie del panel fotovoltaico (2.59 m2).</li>
                            <li><strong>P_panel:</strong> Potencia nominal del panel (540 W).</li>
                            <li><strong>R_i:</strong> Radiación incidente específica según la orientación i (Norte, Sur, Este, Oeste, Plana).</li>
                        </ul>
                        <p>El resultado de esta sumatoria representa el límite técnico de generación del inmueble y se grafica comparativamente junto a la demanda del usuario.</p>
                    `
                }
            ]
        },

    // 23
        {
            seccion: "Metodología",
            fase: "Visualización de Resultados",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "Visualización de datos por predio",
                    contenido: `
                        <p>La presentación de estos datos en la web utiliza técnicas avanzadas para facilitar la comprensión. El usuario obtendrá un mapa interactivo que presenta, en primera instancia los predios de los tres sectores de estudio en escala de color según el número de pisos que las edificaciones presentan. Por otra parte, al dar clic sobre cada uno de estos predios, el usuario podrá observar información técnica referente a identificadores del predio y la información recopilada dentro del proyecto de investigación IMETU, que engloba más de 250 mil datos y se presenta de manera didáctica visual para el usuario de acuerdo a los siguientes criterios: </p>
                        
                        <ul>
                            <li>Clave catastral</li>
                            <li>Número de pisos por predio</li>
                            <li>Número de medidores por predio</li>
                            
                            <li>Implementación de paneles solares Sistemas ON-GRID (Sin Batería)
                                <ul>
                                    <li>Número de paneles recomendado según consumo eléctrico</li>
                                    <li>Inversión estimada en USD</li>
                                    <li>Tiempo de recuperación de la inversión en años y meses</li>
                                    <li>Y ahorro anual posterior a la recuperación de la inversión</li>
                                </ul>
                            </li>
                            
                            <li>Implementación de paneles solares Sistemas OFF-GRID (Con Batería)
                                <ul>
                                    <li>Número de paneles recomendado según consumo eléctrico</li>
                                    <li>Inversión estimada en USD</li>
                                    <li>Tiempo de recuperación de la inversión en años y meses</li>
                                    <li>Y ahorro anual posterior a la recuperación de la inversión</li>
                                </ul>
                            </li>
                            
                            <li>Análisis Energético Mensual
                                <ul>
                                    <li>Energía consumida</li>
                                    <li>Energía recomendada a instalar</li>
                                    <li>Energía máxima a instar</li>
                                </ul>
                            </li>
                        </ul>

                        <p>Para acceder al mapa fotovoltaico visita nuestra página de inicio o da clic en el siguiente link. </p>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "imagen",
                    tituloCaja: "",
                    src: "images/ImgJson24.webp",
                    alt: "GeoVisor"
                }
            ]
        },

        // 24
        {
            seccion: "Metodología",
            fase: "Referencias",
            contenidoIzquierda: [
                {
                    tipo: "texto",
                    tituloCaja: "",
                    contenido: `
                        <ol>
                            <li>Caracterización del consumo energético, la superficie útil y el potencial fotovoltaico en morfologías urbanas contrastantes de una ciudad intermedia. Cuenca – Ecuador. Steven Lopez y Jefferson Torres. Diciembre 2025</li>
                            <li>Understand Your Solar Score for My House: Key Factors Explained, accessed November 30, 2025</li>
                            <li>Consumer Guide to Residential Solar Rooftop Potential - Department of Energy, accessed November 30, 2025</li>
                            <li>use of uav photogrammetry to estimate the solar energy potential of residential buildings in severe cold region - CumInCAD, accessed November 30, 2025</li>
                            <li>ANEXO 4: FICHAS NORMATIVAS - GAD Municipal de Cuenca, accessed November 30, 2025</li>
                            <li>Method for Estimating Solar Energy Potential Based on Photogrammetry from Unmanned Aerial Vehicles - MDPI, accessed November 30, 2025</li>
                            <li>Estimate solar power potential | Documentation - Learn ArcGIS, accessed November 30, 2025</li>
                            <li>What Are the Differences Between On-Grid and Off-Grid Solar? - EcoFlow, accessed November 30, 2025</li>
                            <li>Anexo 3.1 Estructurante c Urbanistico 0 Cuenca | PDF | Planificación - Scribd, accessed November 30, 2025</li>
                            <li>Plan Operativo Bicicletas | PDF | Ecuador | Transporte - Scribd, accessed November 30, 2025</li>
                            <li>De la ciudad densificada a la ciudad paisaje. Tramo parcial de la Avenida Ordóñez Lasso de Cuenca, Ecuador - ucuenca, accessed November 30, 2025</li>
                            <li>Análisis, diagnóstico y valoración del paisaje en el proyecto de ampliación de la avenida, accessed November 30, 2025</li>
                            <li>VENTA DE CASA SECTOR PRIMERO DE MAYO EN CUENCA, accessed November 30, 2025</li>
                            <li>17 Bienes raíces y propiedades cuenca primero mayo en venta en Ecuador - Plusvalía, accessed November 30, 2025</li>
                            <li>Análisis de Sitio en Totoracocha - Prezi, accessed November 30, 2025</li>
                            <li>Totoracocha (parroquia de Cuenca) - Wikipedia, accessed November 30, 2025</li>
                            <li>Universidad del Azuay, accessed November 30, 2025</li>
                            
                        </ol>
                    `
                }
            ],
            contenidoDerecha: [
                {
                    tipo: "texto",
                    tituloCaja: "",
                    contenido: `
                        <ol start="18">
                            <li>Fotogrametría - Instituto Geográfico Nacional, accessed November 30, 2025</li>
                            <li>¿Qué es la fotogrametría?—ArcGIS Pro | Documentación, accessed November 30, 2025</li>
                            <li>Fotogrametría Con Drones: Todo Lo Que Debes Saber | DRONING, accessed November 30, 2025</li>
                            <li>Fotografía: Explicación sencilla de la medición digital de edificios - autarc.energy, accessed November 30, 2025</li>
                            <li>Tecnología de drones en la revolución de la energía solar - Volatus Drones, accessed November 30, 2025</li>
                            <li>Curso Gratuito de Fotogrametría (Parte 1) - YouTube, accessed November 30, 2025</li>
                            <li>Analysis and Precision of Light Detection and Ranging Sensors Integrated in Mobile Phones - MDPI, accessed November 30, 2025</li>
                            <li>Captura de realidad 3D para la construcción de edificios - FlyPix AI, accessed November 30, 2025</li>
                            <li>validación de modelos digitales del terreno de precisión a partir de datos láser escáner aerotransportado, accessed November 30, 2025</li>
                            <li>Is My Roof Suitable for Solar Panels?, accessed November 30, 2025</li>
                            <li>Assess solar potential home - Enphase, accessed November 30, 2025</li>
                            <li>A beginner's guide to solar potential and its estimation, accessed November 30, 2025</li>
                            <li>Methodology - Global Solar Atlas, accessed November 30, 2025</li>
                            <li>Resúmenes por Área - XXV Verano de la Investigación Científica, accessed November 30, 2025</li>
                            <li>Dot Density Map | Data Viz Project, accessed November 30, 2025</li>
                            <li>Vigente el mecanismo para subsidio eléctrico - Celec EP, accessed November 30, 2025</li>
                            <li>Homeowner's Guide to Solar - Department of Energy, accessed November 30, 2025</li>
                            <li>Jenks Natural Breaks Explained, accessed November 30, 2025</li>
                        </ol>
                    `
                }
            ]
        }
    ]
};