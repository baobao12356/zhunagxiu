import React from 'react';
import QueryString from 'query-string';
import { Redirect } from 'react-router';
import { Router, Route, Switch } from 'react-router-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import createMemoryHistory from 'history/createMemoryHistory';
import { bootstrap } from '../../core/Bootstrap';
import DetailPage from './detail';
import MyHome from './my-home';

import '../../lib/iconfont/iconfont.css';
// import './style.scss';
const params = QueryString.parse(location.search);

function Main(props) {
  const { store } = props;
  const memoryHistory = createMemoryHistory();
  syncHistoryWithStore(memoryHistory, store, {
    selectLocationState(state) {
      return state.get('routing').toJS();
    }
  });
  const renderElem = (
    <Router history={memoryHistory}>
      <Switch>
        <Route
          path="/"
          exact
          render={() => {
            const { type, id } = params;
            let toPath = `/myHome/${id}`;
            if (type === 'detail') {
              toPath = `/detail/${id}`;
            }
            return <Redirect to={toPath} />;
          }}
        />
        <Route path="/myHome/:id" exact render={(...params) => <MyHome {...params} {...props} />} />
        <Route path="/myHome/:id/:status" render={(...params) => <MyHome {...params} {...props} />} />
        <Route path="/detail/:id" render={(...params) => <DetailPage {...params} {...props} />} />
      </Switch>
    </Router>
  );

  return renderElem;
}
bootstrap(Main, {
  p_id: QueryString.parse(window.location.search).id,
  p_action_id: QueryString.parse(window.location.search).id,
  lazy: true
});
