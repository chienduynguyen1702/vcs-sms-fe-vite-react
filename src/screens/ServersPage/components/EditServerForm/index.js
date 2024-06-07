import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import ServerForm from '../ServerForm';

import { useListServers } from '../../../../hooks/data';
import { getServerByID } from '../../../../services/api';

const EditForm = ({ editedItemId, onClose }) => {
  const { editServerMutation } = useListServers();
  const method = useForm({});

  const handleSubmit = (data) => {
    const req = {
      data: data,
      server_id: editedItemId,
    };
    editServerMutation.mutate(req, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error('Error editing server:', error);
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getServerByID(editedItemId);
        const serverData = response.data.data; // Assuming response.data contains server information
        // console.log('serverData EditForm', serverData);
        method.reset(serverData); // Populate form fields with server data
      } catch (error) {
        console.error('Error fetching parram data:', error);
      }
    };

    fetchData(); // Call fetchData function when editedItemId changes
  }, [editedItemId, method]);

  return (
    <ServerForm
      title="Edit Server"
      method={method}
      handleSubmit={handleSubmit}
      onLoading={false}
      onClose={onClose}
    />
  );
};

export default EditForm;
