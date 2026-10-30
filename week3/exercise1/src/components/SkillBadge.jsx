import styles from './DeveloperCard.module.css'

export default function SkillBadge({
  name = 'Unknown Skill',
  tier = 'Beginner',
}) {
  return (
    <li className={styles.skillBadge}>
      <strong className={styles.skillName}>{name}</strong>
      <span className={styles.skillTier}>{` (${tier})`}</span>
    </li>
  )
}
