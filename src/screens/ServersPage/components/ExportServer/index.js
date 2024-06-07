import React, { useState } from 'react';
import { AsyncButton, Item } from '../../../../components';
import { toast } from 'react-toastify';
import PreviewTable from '../PreviewTable/Table';

import { utils, writeFile } from 'xlsx';
import moment from 'moment';

const ExportServer = ({ listExportServer, title = '', onClose }) => {
  console.log('ExportServer listExportServer:', listExportServer);

  const handleClickDone = async () => {
    try {
      // exportServer();
      // Create a new workbook
      const workbook = utils.book_new();

      // Convert the JSON array to a worksheet
      const worksheet = utils.json_to_sheet(listExportServer);

      // Append the worksheet to the workbook
      utils.book_append_sheet(workbook, worksheet, 'Servers');

      // Write the workbook to a file by with format name : "servers_date_time.xlsx"
      writeFile(
        workbook,
        `servers_${moment(new Date().getTime()).format('YYYY-MM-DD')}.xlsx`,
      );

      toast.success('Export server successfully');
      console.log('Export server successfully');
      // onClose();
    } catch (error) {
      toast.error('Error exporting server', error);
      console.log('Error exporting server', error);
    }
  };

  return (
    <>
      <Item
        title={'Export Server'}
        className="pb-4 borderBottom"
        classTitle="title-green"
      ></Item>
      Please review list server before exporting
      <PreviewTable listServers={listExportServer} />
      <div
        className="me-2 pt-5 d-flex justify-content-end align-items-center"
        onClick={handleClickDone}
      >
        <AsyncButton
          threeDotsWidth="20"
          threeDotsHeight="20"
          type="submit"
          className="button px-4"
          value="Done"
          notMaxWidth
          loading={false}
        />
      </div>
    </>
  );
};

export default ExportServer;
