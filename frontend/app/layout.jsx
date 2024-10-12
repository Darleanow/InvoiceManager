import PropTypes from 'prop-types';
import './styles/globals.scss';

export const metadata = {
  title: 'Invoice Manager',
  description: 'A platform to manage your invoices',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
