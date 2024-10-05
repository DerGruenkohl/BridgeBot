import { mcBot } from './mc/runMc.ts';
import { runBot } from './discord/runBot.ts';


Promise.all([mcBot(), runBot()]).then(() => {
  console.log("Both apps finished execution");
});




