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
// import ReleaseVersionForm from './components/ReleaseVersionForm';
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
  const [isReleaseMode, setIsReleaseMode] = useState(false);
  const [editedItemId, setEditedItemId] = useState(undefined);
  const [isApplying, setIsApplying] = useState(false);
  const { queryString, setQueryString } = useQueryString();
  const {
    listServers,
    isLoading: isListServersLoading,
    isSuccess: isListUsersSuccess,
    pagination,
    // downloadServers,
  } = useListServers();
  // console.log('listServers', listServers);
  const {
    archivedList,
    isSuccess: isListArchivedSuccess,
    isLoading: isLoadingArchived,
    search,
    handleSearch,
    archiveMutation,
    isArchivedSuccess,
    unarchiveMutation,
  } = useListServersArchived({
    archivedServers: {
      listArchivedAPI: getArchivedServers,
      archiveAPI: archiveServer,
      unarchiveAPI: unarchiveServer,
      keyArchivistList: 'server-archivist-list',
      keyList: 'servers',
      title: 'Server',
      project_id: id,
    },
  });
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
        visible={isReleaseMode}
        onClose={() => {
          setIsReleaseMode(false);
        }}
      ></Modal>
      <Card
        title={`${isListUsersSuccess ? pagination?.total : '0'} Servers`}
        classTitle="title-purple"
        head={
          <>
            <FormSearch placeholder="Search by name" />
            <div className="d-flex">
              {/* <FiltersCustom className="me-2">
                <FormFilter
                  downloadServers={downloadServers}
                />
              </FiltersCustom> */}
              {/* <ButtonDuplicate
                handleClick={() => setIsReleaseMode(true)}
                titleButton="Release Version"
                className="me-2"
              /> */}
              <ButtonAdd
                handleClickAdd={() => setIsAddMode(true)}
                titleButton="Add Server"
                className="me-2"
              />
              <Archived
                title="Archived Servers"
                archivedList={archivedList}
                isSuccess={isListArchivedSuccess}
                isLoading={isListArchivedSuccess}
                search={search}
                handleSearch={handleSearch}
                unarchiveMutation={unarchiveMutation}
              />
            </div>
          </>
        }
      >
        <Table
          listServers={listServers}
          isSuccess={isListUsersSuccess}
          isLoading={isLoadingArchived}
          totalPage={pagination?.totalPage}
          setEditedItemId={setEditedItemId}
          archiveMutation={archiveMutation}
          isArchivedSuccess={isArchivedSuccess}
        />
      </Card>
    </>
  );
};

export default ServersPage;
