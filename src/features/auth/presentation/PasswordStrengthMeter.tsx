import type {
  PasswordStrength,
  PasswordStrengthLevel,
} from '../application/passwordStrength';
import './PasswordStrengthMeter.css';

export interface PasswordStrengthMeterProps {
  readonly strength: PasswordStrength;
}

const FILL_WIDTH: Record<PasswordStrengthLevel, number> = {
  empty: 0,
  weak: 33,
  medium: 66,
  strong: 100,
};

export function PasswordStrengthMeter({
  strength,
}: PasswordStrengthMeterProps) {
  return (
    <div
      className={`password-strength password-strength--${strength.level}`}
    >
      <div
        className="password-strength__meter"
        role="meter"
        aria-label="Fortaleza de la contraseña"
        aria-valuemin={0}
        aria-valuemax={5}
        aria-valuenow={strength.score}
        aria-valuetext={strength.label}
      >
        <span
          className="password-strength__fill"
          style={{ width: `${FILL_WIDTH[strength.level]}%` }}
        />
      </div>
      <p
        className="password-strength__status"
        role="status"
        aria-live="polite"
      >
        Fortaleza: <strong>{strength.label}</strong>
      </p>
    </div>
  );
}
