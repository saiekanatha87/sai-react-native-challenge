import * as types from "../constants/actionTypes";

const checkNodeStatusStart = node => {
  return {
    type: types.CHECK_NODE_STATUS_START,
    node
  };
};

const checkNodeStatusSuccess = (node, res) => {
  return {
    type: types.CHECK_NODE_STATUS_SUCCESS,
    node,
    res
  };
};
const blocksSuccessFound = (node, res) => {
  return {
    type: types.BLOCKS_FOUND,
    node,
    res
  };
};

const checkNodeStatusFailure = node => {
  return {
    type: types.CHECK_NODE_STATUS_FAILURE,
    node
  };
};

const checkBlockStatusFailure = node => {
  return {
    type: types.CHECK_BLOCKS_STATUS_FAILURE,
    node
  };
};

export function checkNodeStatus(node) {
  return async dispatch => {
    try {
      dispatch(checkNodeStatusStart(node));
      const res = await fetch(`${node.url}/api/v1/status`);

      if (res.status >= 400) {
        dispatch(checkNodeStatusFailure(node));
      }

      const json = await res.json();

      dispatch(checkNodeStatusSuccess(node, json));
    } catch (err) {
      dispatch(checkNodeStatusFailure(node));
    }
  };
}

export function checkBlocksStatus(node) { 
  return  dispatch => {
    {
      node.map(async node_item => {
    try {
      const res = await fetch(`${node_item.url}/api/v1/blocks`);

      if (res.status >= 400) {
        dispatch(checkBlockStatusFailure(node));
      }

      const json = await res.json();

      dispatch(blocksSuccessFound(node_item, json));
    } catch (err) {
      dispatch(checkBlockStatusFailure(node));
    }
  });
}
  };
}

export function checkNodeStatuses(list) {
  return dispatch => {
    list.forEach(node => {
      dispatch(checkNodeStatus(node));
    });
  };
}
