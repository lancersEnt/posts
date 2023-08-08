import { log } from 'console';

const followingIds = async (id: string) => {
  const endpoint = 'http://localhost:9009/graphql';
  const headers = {
    'content-type': 'application/json',
  };

  const graphqlQuery = {
    query: `
        query Query($userId: String) {
          getFollowingIds(userId: $userId)
        }
      `,
    variables: {
      userId: id,
    },
  };

  const options = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(graphqlQuery),
  };

  const response = await fetch(endpoint, options);
  const data = await response.json();
  return data.data.getFollowingIds;
};

export default followingIds;
