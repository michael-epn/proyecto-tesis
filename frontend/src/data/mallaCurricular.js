export const mallaCurricular = {
    "Primer período": [
        "Comunicación Oral y Escrita", 
        "Introducción a las TICs", 
        "Cálculo Diferencial e Integral", 
        "Estadística y Probabilidad Básica", 
        "Administración Financiera", 
        "Física"
    ],
    "Segundo período": [
        "Programación", 
        "Sistemas Operativos", 
        "Algoritmos y Estructuras de Datos", 
        "Arquitectura de Computadores", 
        "Redes de Computadores", 
        "Ecología y Ambiente"
    ],
    "Tercer período": [
        "Diseño de Interfaces", 
        "Gestión de Proyectos de Software", 
        "Programación Orientada a Objetos", 
        "Bases de Datos", 
        "Análisis de Datos"
    ],
    "Cuarto período": [
        "Desarrollo de Aplicaciones Web", 
        "Prácticas de Servicio Comunitario", 
        "Desarrollo de loT", 
        "Fundamentos de Inteligencia Artificial", 
        "Prácticas Laborales", 
        "Metodología de la Investigación"
    ],
    "Quinto período": [
        "Desarrollo de Aplicaciones Móviles", 
        "Trabajo de Integración Curricular", 
        "Aplicaciones Distribuidas", 
        "Tecnologías de Seguridad"
    ],
    "Requisitos": [
        "Nivel A2 de Inglés", 
        "Deportes", 
        "Clubes", 
        "Ética Profesional y Social", 
        "Emprendimiento"
    ]
};

export const opcionesMaterias = Object.values(mallaCurricular)
    .flat()
    .map(materia => ({ value: materia, label: materia }));

export const opcionesAgrupadas = Object.entries(mallaCurricular).map(([periodo, materias]) => ({
    label: periodo,
    options: materias.map(materia => ({ value: materia, label: materia }))
}));