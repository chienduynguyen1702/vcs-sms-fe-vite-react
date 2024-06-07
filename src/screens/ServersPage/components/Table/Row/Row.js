import React, { useState } from 'react';
import { EditAndDelete } from '../../../../../components';
import moment from 'moment';

const Row = ({ item, setEditedItemId, deleteMutation, isDeletedSuccess }) => {
  // console.log('item', item);
  // console.log('item.updatedAt', item.updatedAt);
  // console.log(
  //   'item.updatedAt moment',
  //   moment(item.updatedAt).format('yyyy/MM/DD h:mm:ss a'),
  // );
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxSelected = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div className="tableRow" onClick={handleCheckboxSelected}>
      <div className="tableCell py-3 ps-2 roundedLeft">
        <p className="tableCell">
          <input type="checkbox" checked={isChecked} />
        </p>
      </div>
      <p className="tableCell">{item.id}</p>
      <p className="tableCell">{item.name}</p>
      <div className="tableCell">{item.ip}</div>
      <div className="tableCell">{item.description}</div>
      <div
        className="tableCell roundedRight"
        style={{
          width: 'fit-content',
          display: 'flex',
          justifyContent: 'flex-end',
          flex: 1,
          // marginRight: '20px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <EditAndDelete
          itemId={item.id}
          name="parameter"
          setEditedItemId={setEditedItemId}
          deleteMutation={deleteMutation}
          isDeletedSuccess={isDeletedSuccess}
        />
      </div>
    </div>
  );
};

export default Row;
