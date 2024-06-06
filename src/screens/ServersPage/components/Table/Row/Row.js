import React from 'react';
import { PopoverEditAndArchive } from '../../../../../components';
import moment from 'moment';

const Row = ({ item, setEditedItemId, archiveMutation, isArchivedSuccess }) => {
  // console.log('item', item);
  // console.log('item.updatedAt', item.updatedAt);
  // console.log(
  //   'item.updatedAt moment',
  //   moment(item.updatedAt).format('yyyy/MM/DD h:mm:ss a'),
  // );
  return (
    <div className="tableRow">
      <div className="tableCell py-3 ps-2 roundedLeft">
        <p>{item.id}</p>
      </div>
      <p className="tableCell">{item.name}</p>
      <div className="tableCell">{item.ip}</div>
      <div className="tableCell">{item.description}</div>
      <div className="tableCell roundedRight">
        <PopoverEditAndArchive
          itemId={item.id}
          name="parameter"
          setEditedItemId={setEditedItemId}
          archiveMutation={archiveMutation}
          isArchivedSuccess={isArchivedSuccess}
        />
      </div>
    </div>
  );
};

export default Row;
