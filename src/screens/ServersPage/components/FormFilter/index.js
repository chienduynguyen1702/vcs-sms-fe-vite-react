import React, { useMemo } from 'react';
import { FormProvider, set, useForm } from 'react-hook-form';
import { Stack } from 'react-bootstrap';

import { RHFDate, RHFInputSelect, AsyncButton } from '../../../../components';

import { useQueryString } from '../../../../hooks';
import { useListUsers, useListServers } from '../../../../hooks/data/';
import { toast } from 'react-toastify';

export default function FormFilter({ parentFc }) {
  // console.log('version in formfilter', versions);
  const { queryString, setQueryString } = useQueryString();
  const { listUsers } = useListUsers();
  const { sendServerReportToEmailMutation } = useListServers();
  const MOCK_USER_LIST = [
    {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@vcs.vn',
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'janedoe@vcs.vn',
    },
  ];
  const settings = useMemo(() => {
    const stageSettings = queryString.stages || [];
    const environmentSettings = queryString.environments || [];
    const version = queryString.version;

    return {
      stages: Array.isArray(stageSettings) ? stageSettings : [stageSettings],
      environments: Array.isArray(environmentSettings)
        ? environmentSettings
        : [environmentSettings],
      version: version,
    };
  }, [queryString.stages, queryString.environments, queryString.version]);

  const defaultValues = useMemo(() => {
    const defaultValues = {};

    settings.stages.forEach((stage) => {
      defaultValues[stage] = true;
    });

    settings.environments.forEach((environment) => {
      defaultValues[environment] = true;
    });
    settings.version && (defaultValues.version = settings.version);
    return defaultValues;
  }, [settings]);

  const method = useForm({ defaultValues });

  const onClose = () => {
    method.reset();

    // Remove settings from URL params
    const params = { ...queryString };
    if (!!params.stages) {
      delete params.stages;
    }
    if (!!params.environments) {
      delete params.environments;
    }
    if (!!params.version) {
      delete params.version;
    }

    setQueryString(params);

    parentFc(false);
  };

  const handleSubmit = (data) => {
    // const params = { ...queryString };

    // // Remove existing settings from URL params
    // if (!!params.stages) {
    //   delete params.stages;
    // }
    // if (!!params.environments) {
    //   delete params.environments;
    // }
    // if (!!params.version) {
    //   delete params.version;
    // }

    // // Get selected stages and environments
    // const stageSettings = Object.keys(data).filter(
    //   (key) => stages.find((stage) => stage.name === key) && data[key],
    // );
    // const environmentSettings = Object.keys(data).filter(
    //   (key) =>
    //     environments.find((environment) => environment.name === key) &&
    //     data[key],
    // );
    // const versionSettings = data.version;
    // // Add selected stages and environments to URL params
    // if (stageSettings.length > 0) {
    //   params.stages = stageSettings;
    // }
    // if (environmentSettings.length > 0) {
    //   params.environments = environmentSettings;
    // }
    // if (versionSettings) {
    //   params.version = versionSettings;
    // }
    // // Reset page to 1
    // params.page = 1;

    // setQueryString(params);
    parentFc(false);
  };
  const onClickSend = (data) => {
    sendServerReportToEmailMutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.log('error', error.response.data.error);
        toast.error(error.response.data.error, {
          autoClose: 5000,
        });
      },
    });
  };
  const onDownload = () => {
    // const params = { ...queryString };

    // // Remove existing settings from URL params
    // if (!!params.stages) {
    //   delete params.stages;
    // }
    // if (!!params.environments) {
    //   delete params.environments;
    // }
    // if (!!params.version) {
    //   delete params.version;
    // }

    // // Get selected stages and environments
    // const stageSettings = Object.keys(method.getValues()).filter(
    //   (key) =>
    //     stages.find((stage) => stage.name === key) && method.getValues()[key],
    // );
    // const environmentSettings = Object.keys(method.getValues()).filter(
    //   (key) =>
    //     environments.find((environment) => environment.name === key) &&
    //     method.getValues()[key],
    // );
    // const versionSettings = method.getValues().version;
    // // Add selected stages and environments to URL params
    // if (stageSettings.length > 0) {
    //   params.stages = stageSettings;
    // }
    // if (environmentSettings.length > 0) {
    //   params.environments = environmentSettings;
    // }
    // if (versionSettings) {
    //   params.version = versionSettings;
    // }

    // setQueryString(params);
    // downloadParameters(params);
    parentFc(false);
  };
  return (
    <FormProvider {...method}>
      <form onSubmit={method.handleSubmit(onClickSend)}>
        <div className="borderTop borderBottom py-3">
          <RHFDate
            label="From Date"
            nameDate="from"
            tooltip="Select the starting date"
          />
          <RHFDate
            label="To Date"
            nameDate="to"
            tooltip="Select the ending date"
          />

          <RHFInputSelect
            label="Receiver Mail"
            tooltip="Filter by Version"
            name="mail"
            suggestions={listUsers?.map((user) => ({
              label: user.email,
              value: user.email,
            }))}
          />
        </div>

        <Stack direction="horizontal" className="mt-4 justify-content-end">
          <p onClick={onClose} className="button-white">
            Reset
          </p>
          {/* <button className="button-white ms-2" onClick={onDownload}>
            Download
          </button> */}
          {/* <button className="button ms-2" onClick={onClickSend} >Send</button> */}

          <AsyncButton
            threeDotsWidth="20"
            threeDotsHeight="20"
            type="submit"
            className="button ms-2"
            value="Send"
            notMaxWidth
            loading={false}
          />
        </Stack>
      </form>
    </FormProvider>
  );
}
