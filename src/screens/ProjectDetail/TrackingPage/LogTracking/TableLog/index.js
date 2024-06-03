import React, { useState, useEffect } from 'react';
import styles from './Row/Row.module.sass';
import { useParams } from 'react-router-dom';
// import cn from "classnames";
import { Icon, Pagination } from '../../../../../components';
import Filters from '../Filters';
import Row from './Row';
import Checkbox from '../Checkbox';
import { ThreeDots } from 'react-loader-spinner';
import useQueryString from '../../../../../hooks/useQueryString';
import SkeletonTable from './Skeleton';

import { useTracking } from '../../../../../hooks/data';

const statusAlias = ['2xx', '3xx', '4xx', '5xx'];
const sortByTime = ['asc', 'desc'];

const TableLog = ({ items }) => {
  const { id } = useParams();
  const { queryString, setQueryString } = useQueryString();

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [visible, setVisible] = useState(false);
  const [indexSort, setIndexSort] = useState(1);

  // from: "2024-05-01"
  // to : "2024-05-31"
  const from = queryString?.from;
  const to = queryString?.to;
  const { data: listLoggers, isSuccess, isLoading } = useTracking(id, from, to);
  // console.log ('listLoggers', listLoggers);
  // const checkSelected = (id) => {
  //   return selectedFilters.includes(id);
  // };

  useEffect(() => {
    if (queryString?.responseStatus) {
      const responseStatus = queryString.responseStatus.map((x) =>
        statusAlias.indexOf(x),
      );
      setSelectedFilters(responseStatus);
    }
    if (queryString?.sortByTime) {
      setIndexSort(sortByTime.indexOf(queryString.sortByTime));
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setVisible(false);
    }
  }, [isSuccess]);

  // const handleChange = (id) => {
  //   if (checkSelected(id)) {
  //     setSelectedFilters(selectedFilters.filter((x) => x !== id));
  //   } else {
  //     setSelectedFilters((selectedFilters) => [...selectedFilters, id]);
  //   }
  // };

  // const handleTableFilter = () => {
  //   console.log(queryString.responseStatus);
  //   if (queryString.responseStatus) {
  //     console.log('params', [queryString.responseStatus]);
  //     delete queryString.responseStatus;
  //   }
  //   if (selectedFilters.length !== 0) {
  //     console.log('selected filters', selectedFilters, selectedFilters.length);
  //     const responseStatus = selectedFilters?.map((x) => statusAlias[x]);
  //     setQueryString({
  //       ...queryString,
  //       responseStatus,
  //     });
  //   } else setQueryString(queryString);
  // };

  const handleSortByTime = () => {
    setIndexSort(indexSort === 0 ? 1 : 0);
    setQueryString({ ...queryString, sortByTime: sortByTime[indexSort] });
  };

  return (
    <div className={styles.market}>
      <div className={styles.table}>
        <div className={styles.row}>
          <div className={styles.col}>
            Time
            <div
              className={styles.icon_container}
              onClick={() => handleSortByTime()}
            >
              <Icon name="arrows-up-down" size="16" fill="#6F767E" />
            </div>
          </div>
          <div className={styles.col}>Actor</div>
          <div className={styles.col}>Actions</div>
          <div className={styles.col}>Message</div>
          <div className={styles.col}>
            Response Status
            <div className={styles.icon_container}>
              {/* <Filters
                className={styles.filters}
                visible={visible}
                setVisible={setVisible}
              >
                {statusAlias.map((x, index) => (
                  <Checkbox
                    className={styles.checkbox}
                    value={checkSelected(index)}
                    onChange={() => handleChange(index)}
                    content={x}
                    isTickSpace={true}
                    key={index}
                  />
                ))}
                <button
                  className="button"
                  style={{ width: '100%', height: '30px' }}
                  onClick={() => handleTableFilter()}
                >
                  {isLoading ? (
                    <ThreeDots width={50} height={32} />
                  ) : (
                    <span>OK</span>
                  )}
                </button>
              </Filters> */}
            </div>
          </div>
          <div className={styles.col}>Latency</div>
        </div>

        {isLoading && <SkeletonTable />}

        <div className="d-flex flex-column justify-content-between flex-fill">
          <div style={{ height: '650px' }} className=" overflow-y-scroll">
            {listLoggers?.map((log) => (
              <Row
                item={log}
                // key={index}
                // up={items.length - index <= 2}
                // value={selectedFilters.includes(x.id)}
                // onChange={() => handleChange(x.id)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* {isSuccess && listLoggers.length === 0 && <NoData />} */}
      {/* {((isSuccess && listLoggers.length !== 0)) && (
        <Pagination pageCount={1} />
      )} */}
    </div>
  );
};

export default TableLog;
