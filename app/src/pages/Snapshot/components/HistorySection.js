import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import timeDistance from 'date-fns/formatDistanceToNow';

import { Panel } from '../../../components/Panel';
import { Title } from '../../../components/Title';
import { Icon } from '../../../components/Icon';

export const HistorySection = ({ history = [], onItemClick }) => {
  return (
    <Fragment>
      <Title>
        <Icon name="activity-history" /> History
      </Title>
      {
        history.map(history => {
          return (
            <Panel key={history.id} className='item-listing'>
              <div className="item-listing__emphasis">{history.version}</div>
              <div title={new Date(history.approval_date).toLocaleDateString()}>Approved {timeDistance(history.approval_date)} ago</div>
              <button className="button button--collapse" onClick={() => onItemClick(history)}>View Image</button>
            </Panel>
          );
        })
      }
    </Fragment>
  );
};

HistorySection.propTypes = {
  history: PropTypes.array,
  onItemClick: PropTypes.func
};
