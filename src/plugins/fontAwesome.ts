/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';

/* import specific icons */

/* add some free styles */
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faUserSecret, faAddressBook } from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */
// library.add(faUserSecret);

/* add each imported icon to the library */
library.add(faTwitter, faUserSecret, faAddressBook);

export { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText };

export default { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText };