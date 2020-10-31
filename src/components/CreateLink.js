import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { FEED_QUERY } from './LinkList';

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

const CreateLink = () => {
  const history = useHistory();
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [post] = useMutation(POST_MUTATION, {
    onCompleted: () => history.push('/'),
    onError: (e) => console.error(e),
    update: (store, { data }) => {
      const queryData = store.readQuery({ query: FEED_QUERY });
      store.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: [...queryData.feed.links, data.post],
          },
        },
      });
    },
  });

  const onSubmit = () => {
    if (description && url) {
      post({
        variables: {
          description,
          url,
        },
      });
      setDescription('');
      setUrl('');
    }
  };

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          type="text"
          className="mb2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A description for the link"
        />

        <input
          type="url"
          className="mb2"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="The URL for the link"
        />
      </div>

      <button type="button" onClick={onSubmit}>Submit</button>
    </div>
  );
};

export default CreateLink;