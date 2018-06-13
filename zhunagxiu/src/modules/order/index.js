import React from 'react';
import QueryString from 'query-string';
import { Redirect } from 'react-router';
import { Router, Route, Switch } from 'react-router-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import createMemoryHistory from 'history/createMemoryHistory';
import { bootstrap } from '../../core/Bootstrap';
import DecoOrder from './deco-order';

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
            // let toPath = `/order/${id}`;
            let toPath = `/decoOrder/${id}`;
            if (type === 'construct') {
              toPath = `/decoOrder/${id}`;
            }
            return <Redirect to={toPath} />;
          }}
        />
        <Route path="/decoOrder/:id" component={DecoOrder} />
      </Switch>
    </Router>
  );

  return renderElem;
}

bootstrap(Main, {
  p_id: QueryString.parse(window.location.search).id,
  p_action_id: QueryString.parse(window.location.search).id,
});

