import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { Col, Row, Br } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import {
  downloadTemplateServer,
  uploadFileServers,
} from '../../../../services/api';
import {
  RHFTextInput,
  AsyncButton,
  RHFDropdown,
  Item,
  File,
  Icon,
  FileUpload,
} from '../../../../components';
import { toast } from 'react-toastify';

const ImportServer = ({ title = '', onClose }) => {
  const [file, setSelectedFile] = useState({});
  const handleUploadFile = (uploadedFile) => {
    setSelectedFile(uploadedFile);
    // console.log('Uploaded file:', uploadedFile);
  };
  const handleClickDownload = async () => {
    try {
      const response = await downloadTemplateServer();
      const blob = new Blob([response.data], { type: 'text/csv' });
      console.log('Download');
      saveAs(blob, `Server_Import_Template.xlsx`);
    } catch (error) {
      console.log('Error');
    }
  };

  const handleClickDone = async () => {
    if (file.name === undefined) {
      toast.error('Please select a file');
      return;
    }
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append('uploadFile', file, file.name);

    // Details of the uploaded file
    // console.log(file);
    try {
      const response = await uploadFileServers(formData);
      toast.success(`Server imported successfully: ${response.data.message}`);
      onClose();
    } catch (error) {
      toast.error(`Error importing server: ${error.response.data.message}`);
      // console.log('Error', error);
    }
  };
  return (
    <>
      <Item
        title={'Import Server'}
        className="pb-4 borderBottom"
        classTitle="title-green"
      ></Item>
      <div>
        Warning: Importing a server will overwrite the existing server with the
        {'\n\n\n'}
        same name and IP.
        <br />
        Selected file: {file.name}
      </div>
      <div className="pt-5 d-flex justify-content-end align-items-center">
        <div>
          <p onClick={handleClickDownload} className="button-white me-2">
            <Icon name="download" size="24" />
            Download Template
          </p>
        </div>
        <div className="me-2">
          <FileUpload title={'Upload file'} setValue={handleUploadFile}>
            <div>
              <Icon name="upload" size="24" />
              {title}
            </div>
          </FileUpload>
        </div>
        <div className="me-2" onClick={handleClickDone}>
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
      </div>
    </>
  );
};

export default ImportServer;
