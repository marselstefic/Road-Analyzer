import { useContext } from 'react';
import { UserContext } from '../userContext';

function Profile() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <h2>Profile</h2>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Please log in to see this information.</p>
      )}
    </div>
  );
}

export default Profile;
