/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { FC, useState } from 'react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiButtonGroup,
  EuiForm,
  EuiFormRow,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSelect,
  EuiFieldText,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { i18n } from '@kbn/i18n';
import { SWIMLANE_TYPE } from '../../application/explorer/explorer_constants';
import { AnomalySwimlaneEmbeddableInput } from './anomaly_swimlane_embeddable';

export interface AnomalySwimlaneInitializerProps {
  defaultTitle: string;
  influencers: string[];
  initialInput?: Partial<
    Pick<AnomalySwimlaneEmbeddableInput, 'jobIds' | 'swimlaneType' | 'viewBy' | 'limit'>
  >;
  onCreate: (swimlaneProps: {
    panelTitle: string;
    swimlaneType: string;
    viewBy?: string;
    limit?: number;
  }) => void;
  onCancel: () => void;
}

const limitOptions = [5, 10, 25, 50].map(limit => ({
  value: limit,
  text: `${limit}`,
}));

export const AnomalySwimlaneInitializer: FC<AnomalySwimlaneInitializerProps> = ({
  defaultTitle,
  influencers,
  onCreate,
  onCancel,
  initialInput,
}) => {
  const [panelTitle, setPanelTitle] = useState(defaultTitle);
  const [swimlaneType, setSwimlaneType] = useState<SWIMLANE_TYPE>(
    (initialInput?.swimlaneType ?? SWIMLANE_TYPE.OVERALL) as SWIMLANE_TYPE
  );
  const [viewBySwimlaneFieldName, setViewBySwimlaneFieldName] = useState(initialInput?.viewBy);
  const [limit, setLimit] = useState(initialInput?.limit ?? 5);

  const swimlaneTypeOptions = [
    {
      id: SWIMLANE_TYPE.OVERALL,
      label: i18n.translate('xpack.ml.explorer.overallLabel', {
        defaultMessage: 'Overall',
      }),
    },
    {
      id: SWIMLANE_TYPE.VIEW_BY,
      label: i18n.translate('xpack.ml.explorer.viewByLabel', {
        defaultMessage: 'View by',
      }),
    },
  ];

  const viewBySwimlaneOptions = ['', ...influencers].map(influencer => {
    return {
      value: influencer,
      text: influencer,
    };
  });

  const isPanelTitleValid = panelTitle.length > 0;

  const isFormValid =
    isPanelTitleValid &&
    (swimlaneType === SWIMLANE_TYPE.OVERALL ||
      (swimlaneType === SWIMLANE_TYPE.VIEW_BY && !!viewBySwimlaneFieldName));

  return (
    <div>
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <FormattedMessage
            id="xpack.ml.swimlaneEmbeddable.setupModal.title"
            defaultMessage="Anomaly swimlane configuration"
          />
        </EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiModalBody>
        <EuiForm>
          <EuiFormRow
            label={
              <FormattedMessage
                id="xpack.ml.swimlaneEmbeddable.panelTitleLabel"
                defaultMessage="Panel title"
              />
            }
            isInvalid={!isPanelTitleValid}
          >
            <EuiFieldText
              id="panelTitle"
              name="panelTitle"
              value={panelTitle}
              onChange={e => setPanelTitle(e.target.value)}
              isInvalid={!isPanelTitleValid}
            />
          </EuiFormRow>

          <EuiFormRow
            label={
              <FormattedMessage
                id="xpack.ml.swimlaneEmbeddable.setupModal.swimlaneTypeLabel"
                defaultMessage="Swimlane type"
              />
            }
          >
            <EuiButtonGroup
              id="selectSwimlaneType"
              name="selectSwimlaneType"
              color="primary"
              isFullWidth
              legend={i18n.translate('xpack.ml.swimlaneEmbeddable.setupModal.swimlaneTypeLabel', {
                defaultMessage: 'Swimlane type',
              })}
              options={swimlaneTypeOptions}
              idSelected={swimlaneType}
              onChange={id => setSwimlaneType(id as SWIMLANE_TYPE)}
            />
          </EuiFormRow>

          {swimlaneType === SWIMLANE_TYPE.VIEW_BY && (
            <>
              <EuiFormRow
                label={
                  <FormattedMessage id="xpack.ml.explorer.viewByLabel" defaultMessage="View by" />
                }
              >
                <EuiSelect
                  id="selectViewBy"
                  name="selectViewBy"
                  options={viewBySwimlaneOptions}
                  value={viewBySwimlaneFieldName}
                  onChange={e => setViewBySwimlaneFieldName(e.target.value)}
                />
              </EuiFormRow>
              <EuiFormRow
                label={
                  <FormattedMessage id="xpack.ml.explorer.limitLabel" defaultMessage="Limit" />
                }
              >
                <EuiSelect
                  id="limit"
                  name="limit"
                  options={limitOptions}
                  value={limit}
                  onChange={e => setLimit(Number(e.target.value))}
                />
              </EuiFormRow>
            </>
          )}
        </EuiForm>
      </EuiModalBody>

      <EuiModalFooter>
        <EuiButtonEmpty onClick={onCancel}>
          <FormattedMessage
            id="xpack.ml.swimlaneEmbeddable.setupModal.cancelButtonLabel"
            defaultMessage="Cancel"
          />
        </EuiButtonEmpty>

        <EuiButton
          isDisabled={!isFormValid}
          onClick={onCreate.bind(null, {
            panelTitle,
            swimlaneType,
            viewBy: viewBySwimlaneFieldName,
            limit,
          })}
          fill
        >
          <FormattedMessage
            id="xpack.ml.swimlaneEmbeddable.setupModal.confirmButtonLabel"
            defaultMessage="Confirm"
          />
        </EuiButton>
      </EuiModalFooter>
    </div>
  );
};
