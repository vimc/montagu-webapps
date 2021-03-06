import * as React from "react";

import { shallow} from "enzyme";

import "../../helper";
import {DatePickerMonthYearForm} from "../../../main/shared/components/DatePicker/DatePickerMonthYearForm";

const monthsLocale = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const localeUtilsMock = {
    getMonths: () => (monthsLocale)
};

describe("DatePicker", () => {

    it(
        "renders datepicker caption with given current date and months locales",
        () => {
            const rendered = shallow(<DatePickerMonthYearForm
                localeUtils={localeUtilsMock}
                date={new Date(2017, 4, 15)}
                onChange={()=>{}}
                fromMonth={new Date(2016, 4, 15)}
                toMonth={new Date(2018, 4, 15)}
            />);
            const months = rendered.find('select[name="month"]');
            // selected month is may
            expect(months.props().value).toEqual(4);
            const monthsOptions = months.find('option');
            // months in select box
            expect(monthsOptions.length).toEqual(12);
            for (let m = 0; m < 12; m++) {
                expect(monthsOptions.at(m).props().value).toEqual(m);
                expect(monthsOptions.at(m).props().children).toEqual(monthsLocale[m]);
            }
            const years = rendered.find('select[name="year"]');
            // selected year value is 2017
            expect(years.props().value).toEqual(2017);
            const yearsOptions = years.find('option');
            expect(yearsOptions.length).toEqual(3);
            expect(yearsOptions.at(0).props().value).toEqual(2016);
            expect(yearsOptions.at(1).props().value).toEqual(2017);
            expect(yearsOptions.at(2).props().value).toEqual(2018);
        }
    );

});