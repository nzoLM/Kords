import { getAuthToken } from '@/utils/auth';
import { useState, useEffect } from 'react';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      if (userData === null) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
            {
              method : 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
              }
            }
          )
          if (!response.ok) throw new Error('Erreur lors de la récupération des posts');
          const data = await response.json();
          setUserData(data)
        } catch (err) {
          setError(err.message);
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchUserData()
  }, [])

  return (
    <div>
      {
        userData != null && <h1>{userData.username}</h1>
      }
    </div>
  )


}