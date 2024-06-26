import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useQueryString from '../../hooks/useQueryString';

import {
  ButtonDuplicate,
  ButtonAdd,
  Card,
  FormSearch,
  Modal,
  FiltersCustom,
  ButtonExport,
  ButtonImport,
} from '../../components';

import Table from './components/Table/Table';
import AddServerForm from './components/AddServerForm';
import EditServerForm from './components/EditServerForm';
import FormFilter from './components/FormFilter';
import ImportServer from './components/ImportServer';
import { useListServers } from '../../hooks/data';

import ExportServer from './components/ExportServer';
import ButtonSendMail from '../../components/ButtonSendMail';
const ServersPage = () => {
  const { id } = useParams();
  const [isAddMode, setIsAddMode] = useState(false);
  const [isImportMode, setIsImportMode] = useState(false);
  const [isSendMail, setIsSendMail] = useState(false);
  const [editedItemId, setEditedItemId] = useState(undefined);
  const [isExportMode, setIsExportMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const {
    listServers,
    isLoading: isListServersLoading,
    isSuccess: isListServersSuccess,
    pagination,
    deleteServerMutation,
    isDeletedSuccess,
    // downloadServers,
  } = useListServers();
  const handleSelectItem = (item, isChecked) => {
    setSelectedItems((prevSelected) =>
      isChecked
        ? [...prevSelected, item]
        : prevSelected.filter((server) => server.id !== item.id),
    );
  };

  const handleClickExport = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one server to export');
      return;
    } else {
      setIsExportMode(true);
    }
  };

  if (!isListServersSuccess && !isListServersLoading) {
    toast.error('Failed to load servers');
  }
  return (
    <>
      <Modal
        outerClassName={'outerModal'}
        visible={isAddMode || typeof editedItemId !== 'undefined'}
        onClose={() => {
          setIsAddMode(false);
          setEditedItemId(undefined);
        }}
      >
        {isAddMode && (
          <AddServerForm project_id={id} onClose={() => setIsAddMode(false)} />
        )}
        {typeof editedItemId !== 'undefined' && (
          <EditServerForm
            project_id={id}
            editedItemId={editedItemId}
            onClose={() => setEditedItemId(undefined)}
          />
        )}
      </Modal>

      <Modal
        outerClassName={'outerModal'}
        visible={isImportMode}
        onClose={() => {
          setIsImportMode(false);
        }}
      >
        <ImportServer
          onClose={() => {
            setIsImportMode(false);
          }}
        ></ImportServer>
      </Modal>

      <Modal
        outerClassName={'outerModal'}
        visible={isExportMode}
        onClose={() => {
          setIsExportMode(false);
        }}
      >
        <ExportServer
          listExportServer={selectedItems}
          onClose={() => {
            setIsExportMode(false);
          }}
        ></ExportServer>
      </Modal>

      <Modal
        // outerClassName={'outerModal'}
        visible={isSendMail}
        onClose={() => {
          setIsSendMail(false);
        }}
      >
        <FormFilter
          onCloseModal={() => {
            setIsSendMail(false);
          }}
        />
      </Modal>

      <Card
        title={`${isListServersSuccess ? pagination?.total : '0'} Servers`}
        classTitle="title-purple"
        head={
          <>
            <FormSearch placeholder="Search by name" />
            <div className="d-flex">
              <ButtonSendMail
                className="me-2"
                handleClick={() => setIsSendMail(true)}
                titleButton="Report Mail"
              />
              <ButtonDuplicate
                handleClick={() => setIsImportMode(true)}
                titleButton="Import Servers"
                className="me-2"
              />
              <ButtonExport
                handleClickExport={handleClickExport}
                titleButton="Export Servers"
                className="me-2"
              />
              <ButtonAdd
                handleClickAdd={() => setIsAddMode(true)}
                titleButton="Add Server"
                className="me-2"
              />
            </div>
          </>
        }
      >
        <Table
          listServers={listServers}
          isSuccess={isListServersSuccess}
          isLoading={isListServersLoading}
          totalPage={pagination?.totalPage}
          setEditedItemId={setEditedItemId}
          deleteMutation={deleteServerMutation}
          isDeletedSuccess={isDeletedSuccess}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
        />
      </Card>
    </>
  );
};

export default ServersPage;
