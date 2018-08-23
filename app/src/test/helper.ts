import { addTeamCityHooks } from "./TeamCityIntegration";

import * as enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-15";
enzyme.configure({ adapter: new Adapter() });

addTeamCityHooks();
