import { AiFillEdit } from 'react-icons/ai';
import { BiTrash } from 'react-icons/bi';
import { HiDotsHorizontal } from 'react-icons/hi';
import cn from 'classnames';
import Icon from '../Icon';

import { useState } from 'react';
import Modal from '../Modal';
import ConfirmContent from '../ConfirmContent';
import Popover from '../Popover';
import { set } from 'react-hook-form';

const EditAndDelete = ({
  itemId,
  name = '',
  deleteMutation,
  setEditedItemId,
  isDeletedSuccess,
}) => {
  const [isArchiveMode, setIsDeleteMode] = useState(false);
  return (
    <>
      {isArchiveMode && !isDeletedSuccess && (
        <Modal visible={true} onClose={() => setIsDeleteMode(false)}>
          <ConfirmContent
            title="Confirm"
            content={`Are you sure you want to delete this ${name}?`}
            contentBtnSubmit="Delete"
            contentBtnCancel="Cancel"
            isLoading={deleteMutation.isLoading}
            onClose={() => {
              console.log('isDeletedSuccess: ', isDeletedSuccess);
              setIsDeleteMode(false);
            }}
            handleSubmit={() => deleteMutation.mutate(itemId)}
          />
        </Modal>
      )}

      <div
        className={cn('d-flex align-items-center')}
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '20px', // Adjust the gap value as needed to control the space between the spans
        }}
      >
        <span onClick={() => setEditedItemId(itemId)}>
          <AiFillEdit size={18} />
          <span className={'font15 ms-3'}>Edit</span>
        </span>

        <span
          onClick={() => setIsDeleteMode(true)}
          style={{
            color: '#ffb3b3',
          }}
        >
          <BiTrash size={18} />
          <span className={'font15 ms-3'}>Delete</span>
        </span>
      </div>
    </>
  );
};

export default EditAndDelete;
