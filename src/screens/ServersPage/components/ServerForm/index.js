import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Col, Row } from 'react-bootstrap';

import {
  RHFTextInput,
  AsyncButton,
  RHFDropdown,
  Item,
} from '../../../../components';

const Form = ({
  title = '',
  method,
  handleSubmit,
  onLoading,
  onClose,
  ServerInfo,
}) => {
  return (
    <FormProvider {...method}>
      <form onSubmit={method.handleSubmit(handleSubmit)}>
        <Item
          title={title}
          className="pb-4 borderBottom"
          classTitle="title-green"
        >
          <RHFTextInput
            name="name"
            label="Server name"
            type="text"
            placeholder="Enter Server name"
            tooltip="Server name is required"
          />
          <RHFTextInput
            name="ip"
            label="IP address"
            type="text"
            placeholder="Enter IP address"
            tooltip="Server IP address is required"
          />
          <RHFTextInput
            label="Description"
            name="description"
            type="text"
            placeholder="Enter description"
            // tooltip="Description is required"
          />
        </Item>

        <div className="pt-5 d-flex justify-content-end align-items-center">
          <div>
            <p onClick={onClose} className="button-white me-2">
              Cancel
            </p>
          </div>
          <div>
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
      </form>
    </FormProvider>
  );
};

export default Form;
