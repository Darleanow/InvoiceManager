import PropTypes from 'prop-types';
import styles from './ProductEntry.module.scss';
import Image from 'next/image';

export default function ProductEntry({ product }) {
  return (
    <div className={styles.product_entry}>
      <div className={styles.product_icon}>
        {product.icon ? (
          <Image
            src={product.icon}
            alt={product.name}
            className={styles.icon_image}
            width={40}
            height={40}
          />
        ) : (
          <div className={styles.product_icon_text}>{product.name[0]}</div>
        )}
      </div>
      <div className={styles.product_infos}>
        <div className={styles.title_line}>
          <div className={styles.product_category}>{product.category}</div>
          <div className={styles.product_name}>{product.name}</div>
        </div>
        <div className={styles.price_line}>
          <div className={styles.product_price}>
            {product.price} {product.currencySymbol}
          </div>
        </div>
      </div>
    </div>
  );
}

ProductEntry.propTypes = {
  product: PropTypes.shape({
    icon: PropTypes.string,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    currencySymbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
