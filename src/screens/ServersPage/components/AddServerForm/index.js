import { useForm } from 'react-hook-form';

import ServerForm from '../ServerForm';

import { useListServers } from '../../../../hooks/data';

const AddForm = ({ onClose }) => {
  const { addServerMutation } = useListServers();
  const method = useForm({});

  const handleSubmit = (data) => {
    addServerMutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
      onError: () => {
        console.log('Add server error');
      },
    });
  };

  return (
    <ServerForm
      title="Add Server"
      method={method}
      handleSubmit={handleSubmit}
      onLoading={false}
      onClose={onClose}
    />
  );
};

export default AddForm;
