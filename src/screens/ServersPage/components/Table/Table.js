import React from 'react';
import style from './Table.module.sass';
import cn from 'classnames';
import { useParams } from 'react-router-dom';

import Row from './Row/Row';
import { NoData, Pagination } from '../../../../components';
// import { useListServer } from '../../../../hooks/data';
const Table = ({
  listServers,
  isSuccess,
  isLoading,
  totalPage,
  setEditedItemId,
  deleteMutation,
  isDeletedSuccess,
  selectedItems,
  onSelectItem,
}) => {
  const { id } = useParams();
  // console.log('listServers', listServers);
  // console.log('listServer table totalPage', totalPage);

  return (
    <>
      <div className={cn(style.head, 'tableOuter')}>
        <div className="tableContainer">
          <div className="tableHead">
            <div className="tableCell">Select</div>
            <div className="tableCell">Server ID</div>
            <div className="tableCell">Server Name</div>
            <div className="tableCell">IP</div>
            <div className="tableCell">Status</div>
            <div className="tableCell">Description</div>
            <div className="tableCell">Last Ping At</div>
            <div
              className="tableCell"
              style={{
                width: 'fit-content',
                display: 'flex',
                justifyContent: 'flex-end',
                flex: 1,
                // marginRight: '120px',
              }}
            >
              Actions
            </div>
          </div>
          {isSuccess &&
            listServers?.map((item) => (
              <Row
                key={item.id}
                item={item}
                setEditedItemId={setEditedItemId}
                deleteMutation={deleteMutation}
                isDeletedSuccess={isDeletedSuccess}
                isChecked={selectedItems.some(
                  (server) => server.id === item.id,
                )}
                onSelectItem={onSelectItem}
              />
            ))}
        </div>
        {isSuccess && listServers?.length === 0 && <NoData />}
      </div>
      {((isSuccess && listServers?.length !== 0) || isLoading) && (
        <Pagination pageCount={totalPage || 5} />
      )}
    </>
  );
};

export default Table;
