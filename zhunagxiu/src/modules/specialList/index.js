import QueryString from 'query-string';
import { bootstrap } from '../../core/Bootstrap';
import Main from './main';

bootstrap(Main,{
  p_id: QueryString.parse(window.location.search).listId,
  p_action_id: QueryString.parse(window.location.search).listId,
});
