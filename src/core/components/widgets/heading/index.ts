import { registerWidget } from '..';
import { registerIcon } from '../../icon/icon-data';
import IconHeading from './assets/svg/heading.svg';
import HeadingWidget from './src/definition';
import Heading from './src/Heading';

const registerHeading = () => {
  // one way to register the icon
  // registerIcon({ name: 'dme-icon-heading', path: 'M0 0h24v24H0z', viewBox: '0 0 24 24' });
  // another way to register the icon
  registerIcon({ name: 'ic-heading', component: IconHeading });
  registerWidget(HeadingWidget, Heading);
};

export default registerHeading;
