import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row, Stack } from 'react-bootstrap';
import moment from 'moment';

import EditOrganizationForm from '../EditOrganizationForm';
import { Card, Icon, Modal } from '../../../components';
import { useOrganization } from '../../../hooks/data';
const Overview = () => {
  const { id } = useParams();
  // console.log('org id', id);
  const { data: org, isLoading } = useOrganization();

  const [editedItemId, setEditedItemId] = useState(undefined);
  const [isEditMode, setIdEditMode] = useState(false);
  const handleEditClick = (id) => {
    setEditedItemId(id);
  };
  // if (isLoading) {
  //   // Handle loading state if needed
  //   return <p>Loading...</p>;
  // }
  if (!org) {
    // Handle case when organization data is not available
    return <p>No organization data available</p>;
  }
  // console.log('org', org);
  return (
    <>
      <Modal
        outerClassName={'outerModal'}
        visible={isEditMode || typeof editedItemId !== 'undefined'}
        onClose={() => {
          setIdEditMode(false);
          setEditedItemId(undefined);
        }}
      >
        {typeof editedItemId !== 'undefined' && (
          <EditOrganizationForm
            editedItemId={editedItemId}
            orgData={org}
            onClose={() => setEditedItemId(undefined)}
          />
        )}
      </Modal>
      <Card
        title={`Overview`}
        classTitle="title-blue"
        className="mb-5"
        head={
          <>
            <div
              className="cursor-pointer ms-auto"
              onClick={() => {
                setIdEditMode(true);
                // console.log('x');
                handleEditClick(org.id);
              }}
            >
              <Icon name="edit" size={24} />
            </div>
          </>
        }
      >
        <Row>
          <Stack direction="horizontal" gap={3} className="py-2">
            <div className="detail-item">
              <p className="me-auto">Description:</p>
              <p className="detail-content status-text">{org.description}</p>
            </div>
          </Stack>
        </Row>
        <Row className="borderBottom py-2 mb-2">
          <Row>
            <Stack direction="horizontal" gap={3} className="py-2">
              <p className="me-auto">Website:</p>
              <a
                href={org.website_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="status-text ">{org.website_url}</p>
              </a>
            </Stack>
          </Row>
          <Row>
            <Col md={{ span: 5 }}>
              <Stack direction="horizontal" gap={3} className="py-2">
                <p className="me-auto">Establishment date:</p>
                <p className="detail-content status-text">
                  {moment(org.establishment_date).format('YYYY-MM-DD')}
                </p>
              </Stack>
            </Col>
            <Col>
              <Stack direction="horizontal" gap={3} className="py-2">
                <p className="me-auto">Address:</p>
                <p className="detail-content status-text">{org.address}</p>
              </Stack>
            </Col>
          </Row>
        </Row>
      </Card>
    </>
  );
};

export default Overview;
