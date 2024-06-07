import React, { useState } from 'react';
import { EditAndDelete } from '../../../../../components';
import moment from 'moment';

const Row = ({ item }) => {
  return (
    <div className="tableRow">
      <p className="tableCell py-3  roundedLeft">{item.id}</p>
      <p className="tableCell">{item.name}</p>
      <div className="tableCell">{item.ip}</div>
      <div className="tableCell roundedRight">{item.description}</div>
    </div>
  );
};

export default Row;
