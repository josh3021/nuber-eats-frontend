import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { useMe } from '../../../hooks/useMe';
import HeaderLogo from '../logos/header-logo';

const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <>
      {!data?.me.verified && (
        <div className="w-full xl:px-0 p-3 text-center text-white bg-red-500">
          <span>Please verify your email!</span>
        </div>
      )}
      <header className="container py-4">
        <div className="max-w-header justify-between">
          <HeaderLogo />
          <span className="text-xl">
            <Link to="/update-account">
              <FontAwesomeIcon icon={faUser} className="text-2xl" />
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};

export default Header;
