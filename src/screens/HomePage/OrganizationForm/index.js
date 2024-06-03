import React from 'react';
import { FormProvider } from 'react-hook-form';

import { RHFTextInput, AsyncButton, Item } from '../../../components';

const OrganizationForm = ({ title = '', method, handleSubmit, onClose }) => {
  // console.log('OrganizationForm orgData',orgData);
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
            label="Organization name"
            type="text"
            defaultValue="Enter organization name"
            // default={orgData?.name}
            placeholder="Enter organization name"
            tooltip="Organization name is required"
          />
          <RHFTextInput
            name="alias_name"
            label="Alias name"
            type="text"
            defaultValue="Enter alias name"
            // value={orgData?.alias_name}
            placeholder="Enter organization name"
            tooltip="Organization name is required"
          />
          <RHFTextInput
            name="description"
            label="Description"
            type="text"
            defaultValue="Enter description"
            // value={orgData?.description}
            placeholder="Enter description"
          />
          <RHFTextInput
            name="website_url"
            label="Website URL"
            type="text"
            defaultValue="Enter Website URL"
            placeholder="Enter Website URL"
          />
          <RHFTextInput
            name="address"
            label="Address"
            type="text"
            defaultValue="Enter address"
            placeholder="Enter address"
          />
          <RHFTextInput
            name="establishment_date"
            label="Establishment date"
            type="text"
            tooltip="Enter establishment date with format YYYY-MM-DD"
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

export default OrganizationForm;
