import { Fragment, useState } from 'react'
import SkillBadge from './SkillBadge'
import styles from './DeveloperCard.module.css'

function getHttpsAvatar(url) {
  if (typeof url !== 'string') return null

  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === 'https:' ? parsedUrl.href : null
  } catch {
    return null
  }
}

export function DeveloperCard({
  fullName = 'Tran Vinh Khiem',
  role = 'Senior Systems Architect • UIT S3T',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240',
  metrics = { commits: 512, vdomNodes: 0, a11yScore: 100 },
  skills = [{ id: 'sk-1', name: 'React 19 Fiber', tier: 'Core' }],
} = {}) {
  const [failedUrl, setFailedUrl] = useState(null)
  const safeAvatarUrl = getHttpsAvatar(avatarUrl)
  const showAvatar = safeAvatarUrl !== null && failedUrl !== safeAvatarUrl
  const initials = fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'NA'

  return (
    <article className={styles.card} aria-labelledby="dev-heading">
      <header className={styles.header}>
        {showAvatar ? (
          <img
            className={styles.avatar}
            src={safeAvatarUrl}
            alt={`Avatar of ${fullName}`}
            width={64}
            height={64}
            onError={() => setFailedUrl(safeAvatarUrl)}
          />
        ) : (
          <span className={styles.avatarFallback} role="img" aria-label={`Initials of ${fullName}`}>
            {initials}
          </span>
        )}
        <hgroup className={styles.identity}>
          <h2 id="dev-heading">{fullName}</h2>
          <p>{role}</p>
        </hgroup>
      </header>

      <dl className={styles.metrics}>
        {Object.entries(metrics).map(([key, value]) => (
          <Fragment key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </Fragment>
        ))}
      </dl>

      <ul className={styles.skills} aria-label="Engineered Skills">
        {skills.map((skill) => (
          <SkillBadge key={skill.id} name={skill.name} tier={skill.tier} />
        ))}
      </ul>
    </article>
  )
}
