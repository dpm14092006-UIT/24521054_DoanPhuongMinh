import styles from './DeveloperCard.module.css'

export default function SkillBadge({ name, level }) {
  return (
    <li className={styles.skillBadge}>
      <strong className={styles.skillName}>{name}</strong>
      <span className={styles.skillLevel}> — {level}</span>
    </li>
  )
}
