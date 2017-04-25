import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get, find, omit } from 'lodash';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import {
  fetchList,
  getList,
} from '../store/api';

const withResourceList = resourceKey => (WrappedComponent) => {
  const enhance = compose(
    withHandlers({
      onFilter: props => (filter) => {
        const { resourceList: { params }, fetchResourceList } = props;
        fetchResourceList({ ...params, filter });
      },
      onSort: props => (event) => {
        const { resourceList: { params }, fetchResourceList } = props;
        const sort = event.target.value;
        fetchResourceList({ ...params, sort });
      },

      onPageSize: props => (event) => {
        const { resourceList: { params }, fetchResourceList } = props;
        const { page } = params;
        const size = event.target.value;
        fetchResourceList({ ...params, page: { ...page, size } });
      },

      onPageNumber: props => value => (event) => {
        event.preventDefault();
        const { resourceList: { params }, fetchResourceList } = props;
        const { page = {} } = params;
        const number = (page.number || 1) + value;
        fetchResourceList({ ...params, page: { ...page, number } });
      },
    }),
  );

  const mapStateToProps = (state, props) => ({
    resourceList: getList(state, resourceKey),
  });

  const mapDispatchToProps = dispatch => ({
    fetchResourceList: (params = {}) => dispatch(fetchList(resourceKey, params)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(enhance(WrappedComponent));
};

export default withResourceList;
