import React from 'react';
import style from './Table.module.sass';
import cn from 'classnames';
import { useParams } from 'react-router-dom';

import Row from './Row/Row';
import { NoData, Pagination } from '../../../../components';
// import { useListServer } from '../../../../hooks/data';
const PreviewTable = ({ listServers, totalPage }) => {
  const { id } = useParams();
  // console.log('PreviewTable listServers', listServers);
  // console.log('listServer table totalPage', totalPage);

  return (
    <>
      <div className={cn(style.head, 'tableOuter')}>
        <div className="tableContainer">
          <div className="tableHead">
            <div className="tableCell">Server ID</div>
            <div className="tableCell">Server Name</div>
            <div className="tableCell">IP</div>
            <div className="tableCell">Description</div>
          </div>
          {listServers?.map((item) => (
            <Row key={item.id} item={item} />
          ))}
        </div>
        {listServers?.length === 0 && <NoData />}
      </div>
      {/* {listServers?.length !== 0 && <Pagination pageCount={totalPage || 5} />} */}
    </>
  );
};

export default PreviewTable;
