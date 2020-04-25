// font awesome
import { library, config } from '@fortawesome/fontawesome-svg-core';
import {
  faCodeBranch, faAddressCard, faPhone,
  faStar, faBriefcase, faDrum, faBirthdayCake, faCalendarAlt,
  faMale, faGlobeAmericas, faUser, faMapMarkerAlt, faEnvelope,
  faFutbol, faMusic, faCode, faCoffee, faLaptopCode, faFileAlt,
  faInfoCircle, faFilePdf, faBusinessTime,
} from '@fortawesome/free-solid-svg-icons';
import {
  faReact, faInstagram, faGithubSquare, faLinkedin,
} from '@fortawesome/free-brands-svg-icons';


// tslint:disable-next-line: no-object-mutation no-expression-statement
config.autoAddCss = false;
// tslint:disable-next-line: no-expression-statement
library.add(
  faReact, faCodeBranch, faInstagram, faGithubSquare, faLinkedin,
  faAddressCard, faPhone, faStar, faBriefcase, faDrum, faBirthdayCake,
  faCalendarAlt, faMale, faGlobeAmericas, faUser, faMapMarkerAlt, faEnvelope,
  faFutbol, faMusic, faLaptopCode, faCode, faCoffee, faFileAlt, faInfoCircle,
  faFilePdf, faBusinessTime,
);