export default function SkillBadge({ name, level }) {
  return (
    <li className="skillBadge">
      <strong className="skillName">{name}</strong>
      <span className="skillLevel"> — {level}</span>
    </li>
  )
}
