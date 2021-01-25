import { Link } from 'react-router-dom';
import nuberLogo from '../../../images/logo.svg';

const HeaderLogo: React.FC = () => (
  <Link to="/">
    <img src={nuberLogo} className="w-32" alt="Nuber Eats" />
  </Link>
);

export default HeaderLogo;
