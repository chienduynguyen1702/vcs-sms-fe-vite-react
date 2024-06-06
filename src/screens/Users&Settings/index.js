import React, { useMemo } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useMatch } from 'react-router-dom';

const UsersAndSettings = () => {
  const navigate = useNavigate();

  const usersMatch = useMatch('/setting/users');

  const isUsersMode = useMemo(() => {
    return Boolean(usersMatch);
  }, [usersMatch]);

  return (
    <>
      <div className="d-flex mb-3 responsiveTwoButtons">
        <button
          className={`navigateButton ${isUsersMode ? 'active' : ''} `}
          onClick={() => navigate('/setting/users')}
        >
          Users
        </button>
        <button
          className={`navigateButton ${!isUsersMode ? 'active' : ''} `}
          onClick={() => navigate('/setting/roles')}
        >
          Roles
        </button>
      </div>
      <Outlet />
    </>
  );
};

export default UsersAndSettings;
