import QueryString from 'query-string';
import { bootstrap } from '../../core/Bootstrap';
import Main from './main';

bootstrap(Main,{
  p_id: QueryString.parse(window.location.search).detailId,
  p_action_id: `list_id=${QueryString.parse(window.location.search).detailId}`,
});
