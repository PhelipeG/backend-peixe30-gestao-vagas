/* Calcula o score de compatibilidade entre um candidato e uma vaga
 * 
 * Critérios:
 * - Skills match: 70% do score (proporção de skills da vaga que o candidato possui)
 * - Experience: 30% do score (anos de experiência do candidato)
 *   - 0-2 anos: 30%
 *   - 3-5 anos: 60%
 *   - 6-10 anos: 80%
 *   - 10+ anos: 100%
 * 
 * @returns Score de 0 a 100
 */
export function calculateMatchScore(
  candidateSkills: string[],
  jobSkills: string[],
  experienceYears: number
): number {
  // Normalizar skills para lowercase para comparação case-insensitive
  const normalizedCandidateSkills = candidateSkills.map(s => s.toLowerCase());
  const normalizedJobSkills = jobSkills.map(s => s.toLowerCase());

  // Calcular score de skills (70% do total)
  const matchingSkills = normalizedJobSkills.filter(skill => 
    normalizedCandidateSkills.includes(skill)
  ).length;
  
  const skillsScore = normalizedJobSkills.length > 0 
    ? (matchingSkills / normalizedJobSkills.length) * 70 
    : 0;

  // Calcular score de experiência (30% do total)
  let experienceScore = 0;
  if (experienceYears <= 2) {
    experienceScore = 30 * 0.3; // 9 pontos
  } else if (experienceYears <= 5) {
    experienceScore = 30 * 0.6; // 18 pontos
  } else if (experienceYears <= 10) {
    experienceScore = 30 * 0.8; // 24 pontos
  } else {
    experienceScore = 30; // 30 pontos
  }

  // Score final
  const finalScore = Math.round(skillsScore + experienceScore);
  
  return finalScore;
}
