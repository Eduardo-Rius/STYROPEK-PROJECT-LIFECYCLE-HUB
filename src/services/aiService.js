/**
 * AI service placeholders to generate CAPEX-related texts.
 * In a future phase, these functions will connect to OpenAI / Gemini APIs.
 */

// Helper to simulate API call latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates project objectives from a description.
 * @param {string} description 
 * @returns {Promise<string>}
 */
export async function generateObjectives(description) {
  await delay(800);
  return `Objetivos sugeridos por IA para: "${description.substring(0, 40)}...":
1. Lograr la digitalización e integración del 100% de la información del ciclo de vida de los proyectos.
2. Reducir los tiempos de aprobación y flujo documental en un 25% para el cierre del año fiscal.
3. Asegurar la trazabilidad completa y auditoría de todas las decisiones y aprobaciones en CAPEX.`;
}

/**
 * Generates project benefits.
 * @param {string} description 
 * @returns {Promise<string>}
 */
export async function generateBenefits(description) {
  await delay(800);
  return `Beneficios esperados sugeridos por IA:
- **Reducción de Tiempos**: Optimización en la búsqueda de documentos y expedientes (ahorro estimado de 4 horas semanales por líder de proyecto).
- **Cumplimiento**: Mitigación de riesgos de auditoría mediante un registro inmutable de aprobaciones.
- **Eficiencia**: Reemplazo total de trackers manuales en Excel por un flujo de aprobación automatizado.`;
}

/**
 * Generates potential risks.
 * @param {string} description 
 * @returns {Promise<string>}
 */
export async function generateRisks(description) {
  await delay(800);
  return `Riesgos industriales identificados por IA:
1. **Resistencia al Cambio (Probabilidad: Media, Impacto: Alto)**: Dificultad en la adopción del nuevo sistema por parte de contratistas o líderes habituados a flujos por correo.
2. **Retrasos de Aprobación (Probabilidad: Alta, Impacto: Medio)**: Cuellos de botella en etapas directivas o de contraloría.
3. **Calidad de Datos (Probabilidad: Media, Impacto: Alto)**: Datos incompletos introducidos en la Solicitud de Inversión.`;
}

/**
 * Prompts improvement of the text.
 * @param {string} text 
 * @returns {Promise<string>}
 */
export async function improveText(text) {
  await delay(600);
  if (!text || text.trim() === "") return "";
  return `[Texto optimizado por IA]
El proyecto propuesto busca optimizar significativamente la gestión operativa y el control presupuestal de las inversiones de capital (CAPEX) en Styropek. Mediante la centralización en un expediente digital 360°, la solución garantiza la estandarización documental de las etapas de Generación, Planeación, Ejecución y Conclusión (ADP-01 al ADP-04), previniendo desvíos financieros y asegurando el estricto cumplimiento regulatorio y normativo.`;
}

/**
 * Generates a summary of the project.
 * @param {Object} projectInfo 
 * @returns {Promise<string>}
 */
export async function summarizeProject(projectInfo) {
  await delay(1000);
  return `Resumen Ejecutivo de Proyecto (${projectInfo.projectCode || "N/A"}):
El proyecto "${projectInfo.projectName || "Sin nombre"}" se encuentra actualmente en la etapa de "${projectInfo.status || "Borrador"}" (Fase ${projectInfo.currentStage || "ADP-01"}). Tiene un presupuesto estimado de ${projectInfo.estimatedBudgetUSD || 0} USD. Liderado por ${projectInfo.projectLeaderId || "Líder por designar"}, los principales entregables incluyen el expediente de ingeniería y la Solicitud de Inversión aprobada. Se sugiere priorizar la mitigación de los riesgos iniciales asociados a MASH.`;
}

/**
 * Suggests actions to take.
 * @param {Object} projectInfo 
 * @returns {Promise<string>}
 */
export async function suggestActions(projectInfo) {
  await delay(800);
  return `Acciones recomendadas por IA para la etapa actual (${projectInfo.currentStage || "ADP-01"}):
1. **Completar Solicitud de Inversión**: Registrar todos los campos obligatorios del módulo de Finanzas.
2. **Revisión de Seguridad (MASH)**: Agendar la sesión de viabilidad para riesgos de proceso en planta.
3. **Carga de Evidencia**: Subir el levantamiento físico preliminar al expediente de documentos.`;
}
