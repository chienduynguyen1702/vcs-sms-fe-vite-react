import React, { useState } from 'react';
import { EditAndDelete } from '../../../../../components';
import moment from 'moment';
import cn from 'classnames';

const Row = ({
  item,
  setEditedItemId,
  deleteMutation,
  isDeletedSuccess,
  isChecked,
  onSelectItem,
}) => {
  // console.log('item', item);
  // console.log('item.updatedAt', item.updatedAt);
  // console.log(
  //   'item.updatedAt moment',
  //   moment(item.updatedAt).format('yyyy/MM/DD h:mm:ss a'),
  // );
  // const [isChecked, setIsChecked] = useState(false);

  const handleRowClick = () => {
    onSelectItem(item, !isChecked);
  };
  return (
    <div className="d-sm-table-row d-none tableRow" onClick={handleRowClick}>
      <div className="tableCell py-3 ps-2 roundedLeft">
        <p className="tableCell">
          <input type="checkbox" checked={isChecked} readOnly />
        </p>
      </div>
      <p className="tableCell">{item.id}</p>
      <p className="tableCell">{item.name}</p>
      <div className="tableCell">{item.ip}</div>
      <div
        className="status-default"
        style={{ color: item.is_online ? 'green' : 'red' }}
      >
        {item.is_online ? 'Online' : 'Offline'}
      </div>
      <div className="tableCell">{item.description}</div>
      <div className="tableCell">
        {moment(item.ping_at).format('YYYY/MM/DD HH:mm:ss')}
      </div>
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
