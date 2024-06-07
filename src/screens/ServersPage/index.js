import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useQueryString from '../../hooks/useQueryString';

import {
  ButtonDuplicate,
  ButtonAdd,
  Card,
  FormSearch,
  Archived,
  Modal,
  FiltersCustom,
  ButtonApply,
} from '../../components';

import Table from './components/Table/Table';
import AddServerForm from './components/AddServerForm';
import EditServerForm from './components/EditServerForm';
import FormFilter from './components/FormFilter';
import ImportServer from './components/ImportServer';
import styles from './Server.module.sass';
import { useListServers, useListServersArchived } from '../../hooks/data';

import {
  archiveServer,
  getArchivedServers,
  unarchiveServer,
} from '../../services/api';
const ServersPage = () => {
  const { id } = useParams();
  const [isAddMode, setIsAddMode] = useState(false);
  const [isImportMode, setIsImportMode] = useState(false);
  const [editedItemId, setEditedItemId] = useState(undefined);
  const [isApplying, setIsApplying] = useState(false);
  const { queryString, setQueryString } = useQueryString();
  const {
    listServers,
    isLoading: isListServersLoading,
    isSuccess: isListUsersSuccess,
    pagination,
    deleteServerMutation,
    isDeletedSuccess,
    // downloadServers,
  } = useListServers();
  // console.log('listServers', listServers);

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
        visible={isApplying}
        onClose={() => {
          setIsApplying(false);
        }}
      ></Modal>

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
      <Card
        title={`${isListUsersSuccess ? pagination?.total : '0'} Servers`}
        classTitle="title-purple"
        head={
          <>
            <FormSearch placeholder="Search by name" />
            <div className="d-flex">
              {/* <FiltersCustom className="me-2">
                <FormFilter2
                  // downloadServers={downloadServers}
                />
              </FiltersCustom> */}
              <ButtonDuplicate
                handleClick={() => setIsImportMode(true)}
                titleButton="Import Servers"
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
          isSuccess={isListUsersSuccess}
          isLoading={isListServersLoading}
          totalPage={pagination?.totalPage}
          setEditedItemId={setEditedItemId}
          deleteMutation={deleteServerMutation}
          isDeletedSuccess={isDeletedSuccess}
        />
      </Card>
    </>
  );
};

export default ServersPage;
