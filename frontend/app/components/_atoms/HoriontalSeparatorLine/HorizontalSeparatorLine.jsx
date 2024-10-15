import PropTypes from 'prop-types';
import styles from './HorizontalSeparatorLine.module.scss';

export default function HorizontalSeparatorLine({ width, color }) {
  return (
    <hr
      className={styles.separator}
      style={{
        width: width || '100%',
        backgroundColor: color || '#828282',
      }}
    />
  );
}

HorizontalSeparatorLine.propTypes = {
  width: PropTypes.string,
  color: PropTypes.string,
};
