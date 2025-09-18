import styles from "./FormInput.module.scss";

interface FormInputProps {
  id: string;
  value: string;
  name: string;
  label: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  value,
  name,
  label,
  placeholder,
  onChange,
}) => {
  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        className={styles.input}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;
