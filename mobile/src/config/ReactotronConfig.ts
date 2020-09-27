import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';
import reactotronSaga from 'reactotron-redux-saga';

if (process.env.NODE_ENV === 'development') {
  Reactotron.configure({name: 'Rocket Messages'})
    .useReactNative()
    .use(reactotronRedux())
    .use(reactotronSaga({}))
    .connect();

  Reactotron.clear!();
}
