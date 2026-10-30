import { Fragment, useId, useState } from 'react'
import SkillBadge from './SkillBadge'
import styles from './DeveloperCard.module.css'

export default function DeveloperCard({ developer }) {
  const { name, title, gamerTag, location, rank, experience, summary, avatarUrl, skills } = developer
  const [imageFailed, setImageFailed] = useState(false)
  const baseId = useId()
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  const safeAvatarUrl = typeof avatarUrl === 'string' && avatarUrl.startsWith('https://') ? avatarUrl : null
  const details = [
    { label: 'Gamer tag', value: gamerTag },
    { label: 'Location', value: location },
    { label: 'Game rank', value: rank },
    { label: 'Experience', value: experience },
  ]

  return (
    <article className={styles.card} aria-labelledby={`${baseId}-name`}>
      <header className={styles.cardHeader}>
        {safeAvatarUrl && !imageFailed ? (
          <img className={styles.avatar} src={safeAvatarUrl} alt={`Ảnh đại diện của ${name}`} width={88} height={88} onError={() => setImageFailed(true)} />
        ) : (
          <span className={styles.avatarFallback} role="img" aria-label={`Ảnh đại diện viết tắt của ${name}`}>{initials}</span>
        )}
        <hgroup className={styles.identity}>
          <h1 id={`${baseId}-name`}>{name}</h1>
          <p className={styles.role}>{title}</p>
        </hgroup>
      </header>
      <p className={styles.summary}>{summary}</p>
      <dl className={styles.details}>
        {details.map((detail) => (
          <Fragment key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></Fragment>
        ))}
      </dl>
      <section className={styles.skills} aria-labelledby={`${baseId}-skills`}>
        <h2 id={`${baseId}-skills`}>Technical Skills</h2>
        <ul className={styles.skillsList}>
          {skills.map((skill) => <SkillBadge key={skill.name} name={skill.name} level={skill.level} />)}
        </ul>
      </section>
    </article>
  )
}
